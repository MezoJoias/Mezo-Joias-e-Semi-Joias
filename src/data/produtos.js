import colarcorvo from "../assets/colarcorvo.jpeg";
import anelcaveira from "../assets/anelcaveira.jpeg";
import brincobaralho from "../assets/brincobaralho.jpeg";
import brincocaixao from "../assets/brincocaixao.jpg";
import anelcoracaojoia from "../assets/anelcoracaojoia-1.jpeg";
import anelcoracaojoia2 from "../assets/anelcoracaojoia-2.jpeg";
import anelcoracaojoia3 from "../assets/anelcoracaojoia-3.jpeg";
import anelcoracaojoia4 from "../assets/anelcoracaojoia-4.jpeg";
import anelcoracaojoia5 from "../assets/anelcoracaojoia-5.jpeg";

const produtos = [
    {
        id:1,
        nome:"Colar Com Pingente De Corvo",
        preco:"30,00",
        imagem:colarcorvo,
        imagens:[colarcorvo],
        descricao:"Possui Variações",
        categoria:"Colares"
    },

    {
        id:2,
        nome:"Anel Caveira",
        preco:"20,00",
        imagem:anelcaveira,
        imagens:[anelcaveira],
        descricao:"Possui Variações",
        categoria:"Anéis"
    },

    {
        id:3,
        nome:"Brinco Cartas de Baralho",
        preco:"28,00",
        imagem:brincobaralho,
        imagens:[brincobaralho],
        descricao:"Possui Variações",
        categoria:"Brincos"
    },

     {
        id:4,
        nome:"Brinco Caixão Com Cruz",
        preco:"28,00",
        imagem:brincocaixao,
        imagens:[brincocaixao],
        descricao:"Possui Variações",
        categoria:"Brincos"
    },

    {
        id:5,
        nome:"Anel Solitário C/ Zircônia",
        preco:"28,00",
        imagem:anelcoracaojoia,
        imagens:[anelcoracaojoia,anelcoracaojoia2,anelcoracaojoia3,anelcoracaojoia4,anelcoracaojoia5],
        descricao:"Variações: preto, verde, roxo, vermelho, azul ",
        categoria:"Anéis"
    }

]

export default produtos;