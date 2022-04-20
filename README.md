# Recuperação de senha

**RF** Requisitos Funcionais - Descrição de cada funcionalidade do sistema

- O usuário deve poder recuperar sua senha informando seu email
- O usuário deve receber um email com instruções de senha
- O usuário de poder resetar sua senha

**RNF** Requisitos Não Funcionais - São requisitos não ligados diretamente com a regra de negócio

- Ultilizar Mailtrap para testar envios em ambiente de dev;
- Ultilizar Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano (background job);

**RN** Regras de négocio - relacionado com um requisito funcional

- O link enviado por email para resetar a senha, deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;

# Atualização do perfil

**RF**

- O usuário deve poder atualizar seu perfil

**RN**

- O usuário não pode alterar seu email para um email já utilizado
- Para atualizar sua senha , o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha;

# Painel do prestador

**RF**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no mongoDB;
- As notificações do prestador devem ser enviados em tempo-real utilizando Socket.io

**RN**

- A notificação deve ter um status de lida ou não-lida para que o prestador possa controlar;

# Agendamento de serviços

**RF**

- O usuário deve poder listar todos os prestadores de serviço cadastrados
- O usuário deve poder listar os dias de um mês com pelo menos um horario disponível de um prestador
- O usuário de poder listar horários disponíveis em um dia específico de um prestador;
- O usuário deve poder realizar um novo agendamento com um prestador.

**RNF**

- Listagem de prestadores devem ser armazenada em cahe;

**RN**

- Cada agendamento deve durar uma hora exatamente;
- Os agendamentos devem estar disponíveis entre 8h as 18h (Primeiro às 8h, último às 17h);
- O usuário não pode agendar em um horário já ocupado
- O usuário não pode agendar um horário que já passou.
- O usuário não pode agendar de cortar com ele mesmo.
