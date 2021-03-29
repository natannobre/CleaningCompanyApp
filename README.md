# CleaningSquadApp
Web Site developed for a cleaning company to schedule their services.

Documento do Software CleaningCompanyApp

- Colaboradores:
  - Ruan Felipe de Almeida Silva
  - Alan Nascimento Gomes
  - Natan Nobre Chaves

- Contexto:
Uma empresa que realiza a limpeza de imóveis precisa de um site para fazer o gerenciamento e controle, de seus funcionários, clientes e contratos. A empresa tem um administrador que é responsável por conseguir novos clientes e contratos, esse administrador tem o poder de contratar e demitir funcionários, ele também pode alocar um funcionário para a limpeza de uma determinada casa.
Ao chegar um novo cliente na empresa, é necessário escrever um contrato para cada imóvel que o cliente deseja que uma limpeza seja realizada, e neste contrato entre as informações, deve conter o tipo de contrato assinado, que se refere à limpezas semanais, quinzenais ou mensais. O administrador irá alocar um funcionário disponível para realizar todas as limpezas de um imóvel dentro da validade do contrato.

- Objetivo Geral:
Desenvolver um Web Site que faça o controle e o gerenciamento de clientes, contratos, entradas e saídas de dinheiro, e funcionários. Neste site deve ser possível cadastrar e excluir funcionários, clientes, contratos e algumas movimentações financeiras da empresa. Os funcionários e clientes devem disponibilizar dados pessoais para fazer o cadastro, tais como nome completo, email, e telefone de contato. Já os contratos devem possuir um cliente atrelado a ele (pois este contrato se refere a um imóvel), devem possuir também um funcionário designado para fazer as limpezas, outros dados importantes do contrato são as informações do imóvel, como o endereço, tipo de contrato e o preço que será cobrado pelo imóvel.
Sempre que uma limpeza for realizada em um imóvel deve haver uma mudança de status daquela limpeza para concluído, e o agendamento automático da próxima limpeza deste imóvel. Também deve possibilitar o reagendamento da data de limpeza, cobrindo futuros contratempos que possam ocorrer. O Site deve possibilitar a busca de funcionários, clientes, contratos e movimentações financeiras, para que possamos visualizar informações, status ou editar os dados de um determinado cadastro já feito.

- Ferramentas Utilizadas:
  - NodeJS
  - Mongodb
  - Handlebars
  - Body-parser
