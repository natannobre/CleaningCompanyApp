const mascaraData = function mascaraData(data, val) {
    dia = data.getDate()+val;
    mes = data.getMonth()+1;
    ano = data.getFullYear();
    if((dia > 31) || (dia > 28 && mes == 2) || (dia > 30 && mes == 4) || (dia > 30 && mes == 6)  
       || (dia > 30 && mes == 9) || (dia > 30 && mes == 11)){
        dia = 1;
        mes += 1;
    }
    if(mes > 12){
        mes = 1;
        ano += 1;
    }
    data = dia + "-" + mes + "-" + ano

    partesData = data.split("-")
    var novaData

    if (partesData[0].length == 1) {
        novaData = "0" + partesData[0]
    } else {
        novaData = partesData[0]
    }

    novaData = novaData + "/"

    if (partesData[1].length == 1) {
        novaData = novaData + "0" + partesData[1]
    } else {
        novaData = novaData + partesData[1]
    }

    novaData = novaData + "/" + partesData[2]
    return novaData
}

const mascaraDataBanco = function mascaraDataBanco(data) {
    let dataAux = data.toISOString().split("T");
    var partesData = dataAux[0].split("-");
    var novaData;

    if (partesData[2].length == 1) {
        novaData = "0" + partesData[2]
    } else {
        novaData = partesData[2]
    }

    novaData = novaData + "/"

    if (partesData[1].length == 1) {
        novaData = novaData + "0" + partesData[1]
    } else {
        novaData = novaData + partesData[1]
    }

    novaData = novaData + "/" + partesData[0]
    return novaData;
}

module.exports = {
    mascaraData,
    mascaraDataBanco
}