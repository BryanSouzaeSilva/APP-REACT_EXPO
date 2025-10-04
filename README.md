# EMS - Enterprise Management System

Um aplicativo de gerenciamento simples, construído com React Native e Expo, focado em fornecer uma solução de CRUD (Create, Read, Update, Delete) intuitiva para Clientes, Produtos e Fornecedores. Este projeto serve como um estudo prático de conceitos modernos no desenvolvimento mobile.

## 🌟 Funcionalidades Principais

  * **Dashboard Dinâmico:** Tela inicial com estatísticas em tempo real sobre o negócio.
  * **Gerenciamento Completo:**
      * **Clientes:** Cadastro e listagem com dados essenciais.
      * **Produtos:** Controle de nome, valor, estoque e descrição.
      * **Fornecedores:** Gestão de parceiros de negócio.
  * **Tema Adaptável (Light/Dark Mode):** Sincronização automática com o tema do sistema operacional e opção de troca manual.
  * **Persistência de Dados:** As informações são salvas localmente no dispositivo usando `AsyncStorage`.
  * **Experiência de Usuário Aprimorada:**
      * **Inputs com Máscara:** Formatação automática para CPF, CNPJ, telefone e valores monetários.
      * **Navegação Fluida:** Arquitetura de navegação profissional com abas e pilhas (`React Navigation`).
      * **Feedback Visual:** Notificações animadas para ações de sucesso.

## 📸 Demonstração

| Dashboard & Tema                                    | Gerenciamento de Clientes                               |
| --------------------------------------------------- | ------------------------------------------------------- |
| \<img src="URL\_DO\_SEU\_GIF\_AQUI\_1" width="250"\>         | \<img src="URL\_DO\_SEU\_GIF\_AQUI\_2" width="250"\>            |

*(Substitua `URL_DO_SEU_GIF_AQUI` pelos links de GIFs que você pode gravar da tela do seu app)*

## 🛠️ Tecnologias Utilizadas

  * **Framework:** React Native com Expo
  * **Navegação:** React Navigation (`Bottom Tabs` & `Native Stack`)
  * **Gerenciamento de Estado:** React Hooks (`useState`, `useEffect`) e Context API
  * **Armazenamento Local:** `@react-native-async-storage/async-storage`
  * **UI & Componentes:**
      * `@expo/vector-icons` (Ionicons)
      * `react-native-mask-input`
      * `expo-checkbox`

## ⚙️ Como Executar o Projeto

Siga os passos abaixo para rodar o projeto em seu ambiente de desenvolvimento.

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/BryanSouzaeSilva/APP-REACT-EXPO.git
    ```

2.  **Acesse o diretório:**

    ```bash
    cd APP-REACT-EXPO
    ```

3.  **Instale as dependências:**

    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento:**

    ```bash
    npx expo start
    ```

    Após a inicialização, escaneie o QR code com o aplicativo **Expo Go** em seu dispositivo móvel (Android ou iOS) ou execute em um emulador.

## 📂 Estrutura de Pastas

O projeto é organizado de forma a promover a manutenibilidade e escalabilidade do código.

```
/
├── assets/          # Ícones, imagens e fontes
├── components/      # Componentes reutilizáveis (Botões, Inputs, etc.)
├── context/         # Gerenciamento de estado global (ThemeContext)
└── screen/          # Telas e navegadores da aplicação
    ├── Clients/
    ├── Products/
    ├── Suppliers/
    └── navigators/  # Configuração dos navegadores (Stack e Tab)
└── App.js           # Ponto de entrada e configuração principal
```

## 🤝 Como Contribuir

Contribuições são sempre bem-vindas\! Se você tem alguma ideia para melhorar o projeto, siga estes passos:

1.  Faça um **Fork** do projeto.
2.  Crie uma nova branch para sua feature (`git checkout -b feature/MinhaFeature`).
3.  Faça o commit de suas mudanças (`git commit -m 'Adiciona MinhaFeature'`).
4.  Envie para a sua branch (`git push origin feature/MinhaFeature`).
5.  Abra um **Pull Request**.

## 👨‍💻 Autor

Desenvolvido por **Bryan Souza e Silva**.

[](https://www.google.com/search?q=https://www.linkedin.com/in/bryan-souza-e-silva-a83a21239/)
[](https://www.google.com/search?q=https://github.com/BryanSouzaeSilva)
