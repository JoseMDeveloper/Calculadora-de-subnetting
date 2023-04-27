/!zonaSuperior!/
var numSubredes=document.querySelector("#numSubnet");
var direccionIp=document.querySelector("#direccion");
var mascara=document.getElementById("mascara");
var numhost=document.querySelector("#hostXsubred");
var boton=document.getElementById("boton");
/!zonaMedia!/
var binMasc=document.querySelector("#binMasc");
var binIp=document.querySelector("#binIp");

var masc=document.querySelector("#masc");
var sured=document.querySelector("#sured");
var host=document.querySelector("#host");
var Thost=document.querySelector("#Thost");
/!zonaInferior!/
var tabla = document.getElementById("tabla-requisitos");

var numID=1;

var macaraBin;


boton.addEventListener("click", function() {
    dividirYpasarBinario(direccionIp.value);
    establecerValoresTabla();
  });
  const replaceAt = (str, index, replacement) => {
    return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}

function quitarPuntos(cadena) {
    return cadena.replace(/\./g, "");
}

function agregarPuntos(cadena) {
    let nuevaCadena = "";
    for (let i = 0; i < cadena.length; i++) {
        if (i % 8 === 0 && i !== 0) {
            nuevaCadena += ".";
        }
        nuevaCadena += cadena.charAt(i);
    }
    return nuevaCadena;
}

const crearSubred = (ip, mask, numSubNets, nbits) => {
    const arr = [];

    ip = quitarPuntos(ip);

    let tmp = mask + nbits - 1;

    for(let i=mask;i<32;i++)
    {
      ip=replaceAt(ip, i, '0');
      console.log(ip);
    }
    arr.push(agregarPuntos(ip));

    for (let index = 0; index < numSubNets - 1; index++) {
      if (ip[tmp] === '0') {
        ip = replaceAt(ip, tmp, '1');
      } else {
        while (mask <= tmp) {
          if (ip[tmp] === '1') {
            ip = replaceAt(ip, tmp, '0');
            console.log(ip[tmp]);
            tmp--;
          } else {
            ip = replaceAt(ip, tmp, '1');
            tmp = mask + nbits - 1;
            console.log(ip[tmp]);
            break;
          }
        }
      }
        arr.push(agregarPuntos(ip));
    }
    return arr;
}
  function pasarBinario(direccionIp)
  {
    let arreglo = direccionIp.split(".");
    let binario = "";
    for (let i = 0; i < arreglo.length; i++) 
    {
      let valor = parseInt(arreglo[i]);
      //verifica si el valor es posible
      if (isNaN(valor) || valor < 0 || valor > 255) {
        alert("Ingrese un número válido para el segmento " + (i + 1));
        return;
      }
      //transforma a binario y agrega un punto para separar cada segmento
      binario += decimalABinario(valor) + ".";
    }
    //elimina el último punto y rellena con ceros si es necesario
    let binarioConCeros = binario.slice(0, -1).split(".").map((segmento) => {
      return segmento.padStart(8, "0");
    }).join(".");
    return binarioConCeros;
  }
/!pasa una direccion ip a binario, y llama a la funcion de agragar a la tabla vlsm!/
function dividirYpasarBinario(direccionIp) {
    //aca sucede una locura jajajajaj
    var crearSubredes =crearSubred(pasarBinario(direccionIp),parseInt(mascara.value),
    parseInt(numSubredes.value),cantidadR(parseInt(numSubredes.value)));
    console.log(parseInt(mascara.value));
    console.log(cantidadR(parseInt(numSubredes.value)));
    console.log(parseInt(numSubredes.value));
    console.log(pasarBinario(direccionIp));

    if(numhost.value!=="")
    {
        AnadirATabla(numID,crearSubredes,mascaraABinario(parseInt(mascara.value)+
        32 - (parseInt(mascara.value) + cantidadH(parseInt(numhost.value)))),cantidadH(parseInt(numhost.value)));
    }
    else if(numSubredes.value!=="")
    {
        AnadirATabla(numID,crearSubredes ,mascaraABinario(parseInt(mascara.value)+cantidadR(parseInt(numSubredes.value)))
        ,32 - (parseInt(mascara.value) + cantidadR(parseInt(numSubredes.value)))); 
    }
    /!agrega a la tabla de mascara y ip en binario!/
    anadirTablaBin(pasarBinario(direccionIp),mascaraABinario(mascara.value));
    
  }
  
/!agrega a la tabla de binarios!/
function anadirTablaBin(ip,mascara)
{
    binIp.textContent=ip;
    binMasc.textContent=mascara;
}

/!pasa la mascara a binario!/
function mascaraABinario(mascara) {
    if (mascara < 0 || mascara > 32) {
        alert("Máscara inválida");
      return ;
    }
  
    let binario = "";
  
    for (let i = 0; i < 32; i++) {
      if (i < mascara) {
        binario += "1";
      } else {
        binario += "0";
      }
      if ((i + 1) % 8 === 0) {
        binario += ".";
      }
    }
    return binario.slice(0, -1);
  }
  
  
/! pasa un numero decimal a binario!/
function decimalABinario(n) {
    if (n === 0) {
        return "0";
    } else if (n === 1) {
        return "1";
    } else {
        let bit = n % 2;
        return decimalABinario(Math.floor(n / 2)) + bit.toString();
    }
}
/!agrega el contenido a la tabla de vlsm!/
function AnadirATabla(numID, direcciones, mascara, host) {
    for (numID; numID <= direcciones.length; numID++) {
      var fila = tabla.insertRow();
      var celda1 = fila.insertCell();
      var celda2 = fila.insertCell();
      var celda3 = fila.insertCell();
      var celda4 = fila.insertCell();
  
      celda1.textContent = "Subred " + numID;
      celda2.textContent = direcciones[numID - 1];
      celda3.textContent = mascara;
      celda4.textContent = Math.pow(2, host) - 2;
  
      tabla.appendChild(fila);
    }
  }
  
/!me doce la cantidad de bits necesarios para host!/
function cantidadH(numhost) {
    numhost = parseInt(numhost); // convierte el string en un número entero
    if (isNaN(numhost)) {
      return "Error: el valor ingresado no es un número.";
    }
    let valor=numhost+2;
    if ((Math.log2(valor ) % 2) !== 0) {
      return Math.floor(Math.log2(valor))+1;
    } else {
      return Math.log2(valor);
    }
  }
  /!me dice la cantidad de bits necesarios para red!/
  function cantidadR(numSubredes)
  {
    numSubredes=parseInt(numSubredes);
    if (isNaN(numSubredes)) {
        return "Error: el valor ingresado no es un número.";
    }
    if(numSubredes%2!==0)
        return Math.floor(numSubredes/2)+1;
    else
        return numSubredes/2
  }
  /!agrega el contenido a la tabla de bits!/
  function establecerValoresTabla()
  {
      let mascaraNum = parseInt(mascara.value);
      let numhostNum = parseInt(numhost.value);
      let numSub = parseInt(numSubredes.value);
    if(numhost.value!=="" && numSubredes.value=="")
    {
        masc.textContent = mascaraNum;
        sured.textContent = 32 - (mascaraNum + cantidadH(numhostNum));
        host.textContent = cantidadH(numhostNum);
        Thost.textContent=(Math.pow(2, 32 - mascaraNum)-2);
        if(mascaraNum+cantidadH(numhostNum)>32)
        {
            alert("no es posible hacer vlsm")
        }

    }
     if((numSubredes.value!=="" && numhost.value=="") || (numSubredes.value!=="" && numhost.value!==""))
    {
        masc.textContent = mascaraNum;
        sured.textContent = cantidadR(numSub);
        host.textContent=32 - (mascaraNum + cantidadR(numSub));
        Thost.textContent=(Math.pow(2, 32 - mascaraNum)-2);
        if(mascaraNum+cantidadR(numhostNum)>32)
        {
            alert("no es posible hacer vlsm")
        }
    }
  }

  
  
  
  