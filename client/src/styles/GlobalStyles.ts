import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
    }

    html,
    body,
    #root {
        min-height: 100%;
        min-width: 100%;
        scroll-behavior: smooth;
    }

    body {
        font-family: 'Inter', sans-serif;
        background-color: #fcfdfd;
    }

    p, span, h1, h2, h3, h4, h5, h6, label {
        margin: 0px;
        font-family: 'Inter', sans-serif;
    }

    input, select {
        font-family: 'Inter', sans-serif;
        font-size: inherit;
    }

`;

export default GlobalStyles;
