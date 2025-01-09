'use client'
import { getProductById } from '@/service/productService';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaMountainSun } from "react-icons/fa6";

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        } else {
            router.push('/access');
        }
    }, [router]);

    useEffect(() => {
        if (token) {
            getProductById(id, token).then((data) => {
                setProduct(data.data);
                console.log(data.data);
            }).catch((error) => {
                console.error(error);
            });
        }
    }, [id, token]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const imageUrl = product.midia?.imagens?.internas?.[0]?.link;

    return (
        <div className="m-4 flex flex-col justify-between align-middle border-gray-300 rounded-xl p-4 border-2">
            <div className="flex flex-col justify-between align-middle">
                <h2 className="">#{product.codigo}</h2>
                <h1 className="text-lg font-bold">{product.nome}</h1>
            </div>
            <div className="flex justify-between align-middle my-2">
                {imageUrl ? (<Image src={imageUrl} alt={product.nome} width={200} height={200} className='h-32 w-32 border-2 border-gray-300 rounded-lg' />) : (
                    <div className="flex w-fit h-fit p-10
                     border-2 border-gray-300 rounded-lg align-middle items-center justify-center">
                        <FaMountainSun className="align-middle items-center justify-center" size={32} />
                    </div>
                )}
                <div className="my-4 mx-4">
                    <h2 className="text-xl font-semibold">Detalhes do Produto</h2>
                    <div className="flex flex-wrap gap-4">
                        <p className="flex-1 min-w-[200px]"><strong>Código:</strong> {product.codigo}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Categoria:</strong> {product.categoria.id}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Marca:</strong> {product.marca}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Condição:</strong> {product.condicao}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Data de Validade:</strong> {product.dataValidade}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Descrição Complementar:</strong> {product.descricaoComplementar}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Descrição Curta:</strong> {product.descricaoCurta}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Descrição Embalagem Discreta:</strong> {product.descricaoEmbalagemDiscreta}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Dimensões:</strong> {`Largura: ${product.dimensoes.largura}, Altura: ${product.dimensoes.altura}, Profundidade: ${product.dimensoes.profundidade}, Unidade de Medida: ${product.dimensoes.unidadeMedida}`}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Estoque:</strong> {`Mínimo: ${product.estoque.minimo}, Máximo: ${product.estoque.maximo}, Crossdocking: ${product.estoque.crossdocking}, Localização: ${product.estoque.localizacao}, Saldo Virtual Total: ${product.estoque.saldoVirtualTotal}`}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Formato:</strong> {product.formato}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Fornecedor:</strong> {product.fornecedor.id}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Frete Grátis:</strong> {product.freteGratis ? 'Sim' : 'Não'}</p>
                        <p className="flex-1 min-w-[200px]"><strong>GTIN:</strong> {product.gtin}</p>
                        <p className="flex-1 min-w-[200px]"><strong>GTIN Embalagem:</strong> {product.gtinEmbalagem}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Itens por Caixa:</strong> {product.itensPorCaixa}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Linha de Produto:</strong> {product.linhaProduto.id}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Link Externo:</strong> {product.linkExterno}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Observações:</strong> {product.observacoes}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Peso Bruto:</strong> {product.pesoBruto}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Peso Líquido:</strong> {product.pesoLiquido}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Situação:</strong> {product.situacao}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Tipo:</strong> {product.tipo}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Tipo de Produção:</strong> {product.tipoProducao}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Unidade:</strong> {product.unidade}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Volumes:</strong> {product.volumes}</p>
                        <p className="flex-1 min-w-[200px]"><strong>Tributação:</strong> {`Origem: ${product.tributacao.origem}, NFCI: ${product.tributacao.nFCI}, NCM: ${product.tributacao.ncm}, CEST: ${product.tributacao.cest}, Código Lista de Serviços: ${product.tributacao.codigoListaServicos}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}