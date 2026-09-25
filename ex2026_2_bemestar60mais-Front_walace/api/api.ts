import axios from "axios";

const URLPROD = "https://bemstar.extensao-fs.com.br" // para producao
const LOCAL = "http://10.0.2.2:8000" // para emulador


export const API = axios.create({
  baseURL: URLPROD,
});
