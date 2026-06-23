pocoes-e-solucoes
=================

Um website desenvolvido como atividade prática para a disciplina
de Introdução ao Desenvolvimento Web.

# Uso

Dependências:

 - Node.js v26 + npm
 - SQLite 3.53.2

> [!NOTE]
>
> Versões inferiores provavelmente irão funcionar, porém
> não foram testadas.

Após instalar as dependências mencionadas acima usando o gerenciador
de pacotes de sua preferência, instale as dependências do npm, rodando:

```sh
npm install
```

Rode
```sh
node backend/index.ts &
# Coloque o '&' no final do comando anterior para rodá-lo
# no background, ou rode em dois terminais separados.
npm run serve
```
para iniciar o servidor Vite para desenvolvimento e o servidor
do backend. É necessário que as portas 3000 e 8080 estejam disponíveis.

> [!NOTE]
>
> Se você obter um erro de que a sua versão do Node.js não suporta
> rodar Typescript diretamente, mesmo ao usar Node.js v24 ou
> superior, instale o `tsx` para executar arquivos Typescript:
>
> ```sh
> npm i -D tsx
> tsx backend/index.ts
> ```
>
> (necessário apenas em algumas distribuições do Node.js)

Feito isso, o website estará disponível em `http://localhost:3000`.

Para matar os processos dos servidores, use Ctrl+C e `kill %`.

# Estrutura do projeto

 - `src`: código-fonte referente à frontend: páginas, folhas de estilo CSS etc.
 
   Por ser um projeto mais simples, foi adotada uma arquitetura MPA, sem
   uso de bibliotecas de UI reativa.

   - `public/assets`: arquivos de recursos estáticos, como o favicon e fontes.

 - `backend`: código da backend (web service), usando SQLite em memória como
   base de dados.

# Estrutura do website/endpoints

 - `/admin/`: página de uso interno (apenas administrador), embora não haja
   implementação de autenticação e separação de fato

 - `/api/`: endpoints da API da backend/web service
  
 - `/`: páginas publicamente acessíveis
