# CleaningSquadApp
Web Site developed for a cleaning company to schedule their services.

Documento do Software CleaningSquadApp

- Equipe:
  - Ruan Felipe de Almeida Silva - 397048
  - Alan Nascimento Gomes - 400679
  - Natan Nobre Chaves - 402150
  - Isaac Bruno Brandão Maia Lima - 381056

Web Site que irá fazer o controle de uma empresa estadunidense de limpeza de imóveis, este site deve ser capaz de fazer cadastrar equipes de limpeza que serão responsáveis pela limpeza das casas dos clientes (geralmente composta por 2 ou 3 meninas), deve haver também a possibilidade de cadastrar clientes (com as respectivas informações do imóvel), cada cliente requisita limpezas semanalmente, quinzenalmente ou mensalmente. Logo, deve haver um calendário que mostra todas as casas em um certo período de tempo escolhido pelo usuário. Cada equipe deve fazer um check-in ao começar uma nova casa e um check-out ao terminá-la. Ao finalizar uma casa, a equipe deve realizar o check-out, onde será informado qual integrante desta equipe realizou a limpeza de cada cômodo da casa. Este sistema deverá permitir também o cadastro de produtos em estoque para a limpeza (qual produto, quantidade, e o preço do custo). Bem como, deverá ser possível fazer o balanço de entradas e saídas de dinheiro em um período de tempo(Entradas: valor pago pelos clientes; Saídas: Custo de material e pagamento de funcionários)

- Requisitos do Sistema

- Funcionária:
  - Cadastrar funcionária
  - Editar funcionária
  - Deletar funcionária
  - Pesquisar funcionárias
  - Realizar check-in
  - Realizar check-out
- Pedido:
  - Cadastrar pedido
  - Visualizar pedidos do dia
  - Pesquisar pedidos
  - Editar pedido de limpeza
  - Excluir pedido de limpeza
  - Concluir pedido
- Clientes:
  - Cadastrar cliente;
  - Editar cliente;
  - Pesquisar cliente;
  - Deletar cliente;
- Caixa:
  - Adicionar receita;
  - Pesquisar caixa do dia;
  - Pesquisar caixas
- Geral:
  - Realizar login;
  - Controlar o acesso a algumas telas de acordo com o tipo do usuário;
  - Realizar logout;
  - Editar usuário ativo;

- Ferramentas Utilizadas:
  - NodeJS
  - Mongodb
  - Handlebars
  - Body-parser
