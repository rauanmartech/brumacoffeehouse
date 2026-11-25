# Bruma Coffee House

Cardápio digital em português, desenvolvido com JavaScript modular, CSS mobile first e Vite. A aplicação roda inteiramente no navegador.

## Rodar localmente

Use Node.js 22.12+ ou 20.19+ da série 20. Na raiz do projeto, onde está o `package.json`, execute:

```sh
npm ci
npm run dev
```

Abra a URL exibida pelo Vite no terminal. Para testar em um celular na mesma rede, execute `npm run dev -- --host 0.0.0.0` e abra a URL de rede exibida.

## Testar e gerar a versão de produção

```sh
npm test
npm run build
npm run preview
```

A pasta `dist/` contém a versão estática de produção. A configuração de caminhos relativos permite servi-la tanto na raiz de um domínio como em uma subpasta, inclusive no GitHub Pages. Para colocar o código no GitHub, use o conteúdo desta pasta como raiz do repositório. Dependências e builds locais estão no `.gitignore`.

## Estrutura

```text
index.html              Documento inicial e regiões semânticas
public/
  fonts/                Fontes locais WOFF2 e licenças
  images/campanhas/     Quatro fundos, quatro recortes e um banner final
  images/produtos/      Um recorte WebP com transparência por produto
  mark.svg              Símbolo reutilizável da cafeteria
src/
  data/menu.js          Categorias, produtos, fotos e valores em centavos
  data/house.js         Promoções, navegação, contato e dados da cafeteria
  lib/                  Busca, totais e persistência do pedido
  ui/                   Ícones, carrossel, cards e painéis
  styles/               Estilos globais, catálogo e diálogos
  main.js               Interações e montagem da página
tests/                  Verificações do catálogo, carrinho e assets
```

## Personalização

A Bruma é uma identidade demonstrativa. Revise preços, notas, contagens de avaliações, horários, ingredientes e informações sobre alergênicos com o estabelecimento antes de publicar. As categorias e os produtos podem ser substituídos em `src/data/menu.js`.

Em `src/data/house.js`, configure `address`, `mapsUrl`, `contact`, `instagramUrl` e `whatsapp`. O WhatsApp de pedidos está configurado para **(71) 98378-9492**. Para trocar o destino, use o número internacional completo, apenas com dígitos.

No carrinho, o cliente informa rua, número, bairro e cidade. O complemento é opcional. Ao continuar, o WhatsApp abre com os itens, valores e endereço para o cliente revisar e enviar. O endereço fica na memória da página durante a visita. As quantidades ficam salvas no navegador pela chave `bruma.cart.v1`. Se o estabelecimento remover o número da configuração, o carrinho oferece a opção de copiar o resumo.

O carrossel tem navegação manual por indicadores, setas, arraste e swipe. A busca percorre todas as categorias. O carrinho e os modais aceitam teclado e respeitam a preferência de movimento reduzido.

