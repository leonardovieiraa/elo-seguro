# Elo Seguro — aplicação com backend PostgreSQL

Aplicação Next.js 15 + TypeScript integrada ao PostgreSQL usando Prisma ORM.

## Requisitos
- Node.js 20.9 ou superior
- PostgreSQL acessível pela aplicação

## Configuração
1. Instale as dependências: `npm install`
2. Configure o arquivo `.env` (use `.env.example` como referência):
   - `DATABASE_URL`: conexão PostgreSQL com `sslmode=require` quando exigido pelo provedor.
   - `AUTH_SECRET`: segredo aleatório com pelo menos 32 caracteres.
3. Gere o Prisma Client: `npm run db:generate`
4. Crie/aplique a estrutura do banco: `npm run db:migrate -- --name init`
5. Inicie: `npm run dev`

Acesse `http://localhost:3000`, crie sua conta e entre no aplicativo.

## Backend incluído
- Cadastro e login por e-mail e senha (hash bcrypt, custo 12).
- Sessão JWT em cookie HttpOnly, Secure em produção, SameSite=Lax e validade de 7 dias.
- API autenticada para carregar e salvar os dados do usuário.
- Dados isolados por conta no PostgreSQL.
- Prisma ORM e modelo User.

## Endpoints
| Método | Rota | Finalidade |
|---|---|---|
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/login` | Entrar |
| POST | `/api/auth/logout` | Sair |
| GET | `/api/auth/me` | Consultar sessão |
| GET | `/api/data` | Carregar dados do usuário |
| PUT | `/api/data` | Persistir dados do usuário |

## Observações
- O estado que antes ficava no `localStorage` agora é carregado e sincronizado com o PostgreSQL.
- Contatos, alertas, perfil, preferências, notificações e compartilhamento são armazenados no campo JSON privado de cada usuário.
- O estado de conexão/bateria da pulseira ainda é simulado pelo frontend; este pacote não inclui integração com hardware ou envio real de SMS/WhatsApp.
- Não publique o arquivo `.env`. Troque a senha do banco caso ela tenha sido compartilhada em canais não privados.

## Compartilhamento de localização em tempo real
- O usuário autenticado cria um link aleatório e não enumerável em `/localizacao/[token]`.
- O app envia as coordenadas ao servidor a cada 5 segundos enquanto a tela de compartilhamento está aberta.
- Quem recebe o link visualiza o mapa público, que consulta a posição mais recente a cada 5 segundos; não precisa criar conta.
- O link pode expirar conforme a duração escolhida ou ser revogado imediatamente ao tocar em **Parar de compartilhar**.
- A rota pública não revela e-mail, telefone ou outros dados da conta; exibe apenas o nome cadastrado e a localização.
- É necessário acessar o app por HTTPS (ou localhost durante desenvolvimento) e permitir a geolocalização no navegador.
- Em celulares, navegadores podem suspender atualizações quando o app fica em segundo plano ou a tela é bloqueada. Para rastreamento contínuo com tela bloqueada, será necessária uma implementação nativa com serviço de localização em segundo plano.

### Endpoints de localização
| Método | Rota | Finalidade |
|---|---|---|
| POST | `/api/location/share` | Criar link com duração opcional |
| PATCH | `/api/location/share` | Atualizar coordenadas (sessão autenticada) |
| DELETE | `/api/location/share` | Revogar link |
| GET | `/api/location/[token]` | Consultar localização pelo link público |

Após atualizar o projeto, execute `npm run db:generate` e `npm run db:push` para sincronizar o novo modelo `LocationShare` com o banco existente sem apagar os dados atuais.

### Diagnóstico de permissão do GPS
- O app agora informa a causa provável do erro de geolocalização em vez de ocultar o erro original.
- A solicitação nativa do navegador é acionada ao clicar em **Começar a compartilhar**.
- Geolocalização exige HTTPS em produção; `http://localhost` é permitido para desenvolvimento. Acesso por IP local em HTTP (por exemplo, `http://192.168.x.x`) normalmente é bloqueado.
- Se a permissão já foi negada anteriormente, o navegador não mostra uma nova janela. No Chrome/Edge: clique no ícone à esquerda do endereço > Configurações/Permissões do site > Localização > Permitir; depois recarregue a página.
- No celular, habilite também os Serviços de Localização/GPS nas configurações do sistema e permita o acesso ao navegador.
