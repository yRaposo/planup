'use client'
import React, { useCallback, useContext, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import OnDev from "@/components/OnDev";
import { FaPlusCircle } from 'react-icons/fa';
import { IoIosDocument, IoIosWarning, IoMdCloudUpload } from 'react-icons/io';
import StylezedBtn from '@/components/StylezedBtn';
import { MdLaunch } from 'react-icons/md';
import { CgSpinner } from 'react-icons/cg';
import { AuthContext } from '@/context/AuthContext';
import { getProductsQ } from '@/utils/requestQueue';
import { getDepositos } from '@/service/depositoService';
import { FaListCheck } from 'react-icons/fa6';

export default function Upload() {
    const { accounts } = useContext(AuthContext);
    const [allProducts, setAllProducts] = React.useState([]);
    const [productAccounts, setProductAccounts] = React.useState({});
    const [fileName, setFileName] = React.useState(null);
    const [fileError, setFileError] = React.useState('');
    const [file, setFile] = React.useState([]);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [product, setProduct] = React.useState(null);
    const [deposits, setDeposits] = React.useState({});
    const [selectedDeposits, setSelectedDeposits] = React.useState({});
    const [isDepositoEmpty, setIsDepositoEmpty] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [verifyedProducts, setVerifyedProducts] = React.useState([]);
    const [isCheking, setIsCheking] = React.useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (file.type !== 'text/csv') {
                setFileError('Por favor, selecione um arquivo .csv');
                setFileName(null);
                setFile([]);
            } else {
                setFileError('');
                setFileName(file.name);
                Papa.parse(file, {
                    header: true,
                    complete: (results) => {
                        setFile(results.data);
                    }, error: (error) => {
                        setFileError('Erro ao ler o arquivo');
                        console.error(error);
                        setFileName(null);
                        setFile([]);
                    }
                });
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'text/csv',
        maxFiles: 1
    });

    const fetchDeposits = useCallback(async () => {
        const newDeposits = [];
        for (const account of accounts) {
            if (account.token) {
                await getDepositos(account.token).then(data => {
                    newDeposits[account.token] = data.data;
                    console.log('Depósitos:', data);
                }).catch(error => {
                    console.error('Erro ao obter depósitos:', error);
                });
            }
        }
        setDeposits(newDeposits);
        console.log('Depósitos:', newDeposits);
    }, [accounts]);

    useEffect(() => {
        fetchDeposits();
    }, [fetchDeposits]);

    const fetchProducts = useCallback(async (key, row) => {
        const newProducts = {};
        for (const account of accounts) {
            if (account.token) {
                try {
                    const data = await getProductsQ(1, 1, account.token, row.SKU);
                    console.log('Produto bruto:', data);
                    const filteredProducts = data.data.filter(newProduct =>
                        newProduct.codigo.toLowerCase() === row.SKU.toLowerCase() && !newProducts[account.token]?.some(existingProduct => existingProduct.id === newProduct.id)
                    );
                    console.log('Produto filtrado:', filteredProducts)
                    if (filteredProducts.length > 0) {
                        newProducts[account.token] = filteredProducts.reduce((acc, product) => {
                            acc[product.id] = product;
                            return acc;
                        }, {});
                        console.log('Resultado', { [key]: newProducts });
                        return newProducts;
                    }
                } catch (error) {
                    console.error('Erro ao obter produtos:', error);
                }
            }
        }
        return null;
    }, [accounts]);

    const handleVerify = async () => {
        setIsCheking(true);
        const newVerifyedProducts = [];
        await Promise.all(file.map(async (row, index) => {
            const data = await fetchProducts(index, row);
            if (data) {
                newVerifyedProducts.push(data);
            }
        }));
        setVerifyedProducts(newVerifyedProducts);
        setIsCheking(false);
        console.log('Produtos verificados:', newVerifyedProducts);
    }

    const handleSubmit = () => {
        console.log('Produtos verificados:', verifyedProducts);
    }

    const handleDepositoChange = (accountToken, event) => {
        const newSelectedDeposits = { ...selectedDeposits, [accountToken]: event.target.value };
        setSelectedDeposits(newSelectedDeposits); // Atualiza o estado com o depósito selecionado para a conta
        setIsError(false);
        console.log('Depositoaaaaaaaaaaa:', newSelectedDeposits);
        console.log('Depositos selecionados:', selectedDeposits);
    };

    return (
        <div className="mx-4 mb-4 align-middle w-auto flex flex-col justify-center">
            {/* <div className='justify-center mb-2 w-full'>
                <OnDev />
            </div> */}


            <div className="flex justify-center w-full mb-4">
                <div  {...getRootProps()} className={`flex border-2 border-gray-300 rounded-xl p-4 cursor-pointer w-full h-52 justify-center items-center hover:bg-gray-100 
                ${fileError
                        ? ('border-red-800 bg-red-200')
                        : file && file.length > 0
                            ? ('justify-start h-auto items-start flex-none')
                            : isDragActive
                                ? ('bg-gray-100 border-dashed')
                                : ('')
                    }`}>
                    <input {...getInputProps()} className="justify-center items-center flex" multiple={false} accept='.csv' />
                    {
                        fileError !== ''
                            ? <div className='flex flex-col justify-center items-center'>
                                <IoIosWarning className="text-red-500" size={32} />
                                <p className='text-center font-bold text-red-800'>
                                    {fileError}
                                </p>
                            </div>
                            : fileName
                                ? <div className='flex flex-row justify-start items-center'>
                                    <IoIosDocument size={32} color='#000' />
                                    <p className='text-center font-bold'>
                                        {fileName}
                                    </p>
                                </div>
                                : isDragActive
                                    ? <div className='flex flex-col justify-center items-center'>
                                        <FaPlusCircle size={32} color='#000' />
                                        <p className='text-center font-bold'>
                                            Solte o arquivo aqui
                                        </p>
                                    </div>
                                    : <div className='flex flex-col justify-center items-center'>
                                        <IoMdCloudUpload size={32} color='#000' />
                                        <p className='text-center font-bold'>
                                            Arraste e solte um arquivo .csv aqui, ou clique para selecionar arquivos
                                        </p>
                                    </div>
                    }
                </div>
            </div>
            {file.length > 0 && (
                <>
                    <label className="text-sm mt-2">Depósito</label>
                    <div className="border-2 border-gray-300 rounded-xl p-4 mt-2 flex flex-col gap-2">
                        {deposits && Object.keys(deposits).map(accountToken => {
                            const account = accounts.find(acc => acc.token === accountToken);
                            return (
                                <div className="" key={accountToken}>
                                    <h3>{account ? account.email : 'Conta não encontrada'}</h3>
                                    <select value={selectedDeposits[accountToken] || ''} onChange={(e) => handleDepositoChange(accountToken, e)} className={`w-full p-2 mt-1 border-2 rounded-full appearance-none ${isDepositoEmpty ? 'border-red-800' : 'border-gray-300'}`}>
                                        <option value="" disabled hidden>Selecione um depósito</option>
                                        {deposits[accountToken].map(dep => (
                                            <option key={dep.id} value={dep.id}>{dep.descricao}</option>
                                        ))}
                                    </select>
                                </div>
                            );
                        })}
                    </div>
                    <div className='flex flex-row justify-end mt-4 gap-2'>
                        <StylezedBtn props={{ icon: isCheking ? (<CgSpinner className="animate-spin" />) : (<FaListCheck />), text: 'Verificar' }} onClick={() => handleVerify()} />
                        <StylezedBtn props={{ icon: isProcessing ? (<CgSpinner className="animate-spin" />) : (<MdLaunch />), text: 'Lançar' }} onClick={() => handleSubmit()} />
                    </div>

                    <div className='flex flex-col justify-center items-center mt-4 border-2 border-gray-300 rounded-xl'>
                        <table className="table-auto min-w-full">
                            <thead>
                                <tr>
                                    {Object.keys(file[0]).map((key) => (
                                        <th key={key}
                                            className='px-4 py-2 font-bold border-b border-gray-200 text-start'>
                                            {key}
                                        </th>))}
                                    <th className='px-4 py-2 font-bold border-b border-gray-200 text-start'>
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {file.map((row, index) => (
                                    <tr key={index}>
                                        {Object.values(row).map((value, i) => (
                                            <td key={i} className="py-2 px-4 border-b border-gray-200">
                                                {value}
                                            </td>
                                        ))}
                                        <td className='py-2 px-4 border-b border-gray-200'>
                                            <FaListCheck />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>

    );
}