# App de Cadastro - Estudo de React Native com Expo

Este é um projeto de estudo desenvolvido para praticar conceitos fundamentais e intermediários de React Native utilizando o ecossistema Expo. O aplicativo consiste em um sistema simples de CRUD (Create, Read) para gerenciar clientes e produtos, com funcionalidades modernas como tema dinâmico e navegação profissional.

## ✨ Funcionalidades

* **Cadastro de Clientes e Produtos:** Formulários completos com validação de campos.
* **Máscaras de Input:** Campos de Valor (Moeda), Telefone e CPF formatados automaticamente para melhor experiência do usuário.
* **Listagem de Dados:** Exibição dos clientes e produtos cadastrados em listas dinâmicas.
* **Dashboard Inicial:** Tela de início que apresenta estatísticas em tempo real, como número de clientes, produtos e valor total do estoque.
* **Sistema de Tema (Claro/Escuro):**
    * Alternância manual de tema (Light/Dark Mode) na tela de configurações.
    * Detecção e aplicação automática do tema padrão do sistema operacional do celular ao iniciar o app.
* **Gerenciamento de Estado Global:** Utilização da Context API do React para gerenciar o tema e os dados da aplicação de forma centralizada e reativa.
* **Navegação Profissional:**
    * **Navegação por Abas (Tab Navigation):** Para alternar entre as seções principais do app (Início, Produtos, Clientes, Configurações).
    * **Navegação por Pilha (Stack Navigation):** Aninhada dentro das abas para gerenciar o fluxo de telas (ex: da lista para o formulário).

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

* **React Native**
* **Expo**
* **React Navigation** (`Bottom Tabs` e `Native Stack`)
* **React Hooks** (`useState`, `useEffect`, `useContext`)
* **Context API** para gerenciamento de estado
* **`react-native-mask-input`** para formatação de inputs
* **`@expo/vector-icons`** para os ícones da interface

## ⚙️ Como Rodar o Projeto

Para executar este projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/BryanSouzaeSilva/APP-REACT-EXPO.git](https://github.com/BryanSouzaeSilva/APP-REACT-EXPO.git)
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd APP-REACT-EXPO
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento do Expo:**
    ```bash
    npx expo start
    ```
    Após iniciar, leia o QR code com o aplicativo Expo Go no seu celular ou execute em um emulador.

## 📂 Estrutura de Pastas

O projeto está organizado da seguinte forma para manter o código limpo e escalável:

```
/
├── assets/           # Imagens e fontes
├── components/       # Componentes reutilizáveis (ex: BotaoPersonalizado)
├── context/          # Provedores de Contexto (ex: ThemeContext)
├── screen/           # Contém todas as telas e navegadores
│   ├── Clients/      # Telas relacionadas a Clientes (Form e List)
│   ├── Products/     # Telas relacionadas a Produtos (Form e List)
│   └── navigators/   # Arquivos de configuração dos StackNavigators
└── App.js            # Ponto de entrada principal e configuração do TabNavigator
```

## 👨‍💻 Autor:

Desenvolvido por **Bryan Souza e Silva** como parte do seu aprendizado em desenvolvimento mobile.

---
