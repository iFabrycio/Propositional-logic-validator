$( document ).ready(function (){
  $(".truth-table").hide();
  $(".left-side-queue").hide();

  $("#negation").click(function() {
    append = $("#negation").val();
    appendToInput(append);
  })

  $("#implicates").click(function() {
    append = $("#implicates").val();
    appendToInput(append);
  })

  $("#bi-implicates").click(function() {
    append = $("#bi-implicates").val();
    appendToInput(append);
  })

  $("#and").click(function() {
    append = $("#and").val();
    appendToInput(append);
  })

  $("#or").click(function() {
    append = $("#or").val();
    appendToInput(append);
  })

  $("#start-pontuation").click(function() {
    append = $("#start-pontuation").val();
    appendToInput(append);
  })

  $("#end-pontuation").click(function() {
    append = $("#end-pontuation").val();
    appendToInput(append);
  })
});

function concept()
{
  $('.left-side-queue').toggle(500);
}

function put(text)
{
  $('input').val(text);
}

function appendToInput(append)
{
  actualPosition = $('#input')[0].selectionStart;
  $('#input').val(($('#input').val()).substring(0, actualPosition) + append + ($('#input').val()).substring(actualPosition));
}

function textToArray(inputText)
{
  return inputText.split('');
}

function validate()
{
  inputText = normalizeText($('#input').val());

  if (inputText == '') {
    customMessage('info', 'Insira uma lógica proposicional.');
    return;
  }

  inputArray = textToArray(inputText);

  let openPontuation = false;
  let canBePropositional = true;
  let canBeConective = true;

  for(i = 0; i < inputArray.length; i++) {

    if (!isBoolean(inputArray[i]) && !isConective(inputArray[i])
      && !isPontuation(inputArray[i]) && !isPropositional(inputArray[i])) {
        customMessage('fail','Inválido, <code>' + inputArray[i] + '</code> não é um caractere válido.');
        return;
      }

    if (
      (i == 0 && isConective(inputArray[i], '¬')) ||
      (i == inputArray.length - 1 && isConective(inputArray[i])) ||
      (i == 0 && isPontuation(inputArray[i], ')')) ||
      (i == inputArray.length - 1 && isPontuation(inputArray[i], '(')) 
      ) {
      customMessage('fail', 'Inválido, <code>' + inputArray[i] + '</code> está em uma posição inválida');
      return;
    }

    if ((canBePropositional && isPropositional(inputArray[i])) || (!canBePropositional && isPontuation(inputArray[i]))) {
      canBePropositional = false;
    } else if (isPropositional(inputArray[i])) {
      customMessage('fail', 'Inválido, não é permitido dois proposicionais estarem juntos');
      return;
    } else {
      canBePropositional = true;
    }

    if (isPontuation(inputArray[i])) {
      openPontuation = !openPontuation;
    }

    if (!canBeConective && isConective(inputArray[i], '¬')) {
      customMessage('fail', 'Inválido, <code>' + inputArray[i] + '</code> está em uma posição inválida');
      return;
    } else if (isConective(inputArray[i])) {
      canBeConective = false;
    } else {
      canBeConective = true;
    }

  }

  if(openPontuation) {
    customMessage('fail', 'Inválido, Pontuação aberta');
    return;
  }

  customMessage('success', '<code>' + inputText + '</code> é uma lógica proposicional válida!');
  generateTruthTable(inputText);
  return;
}

function normalizeText(text, toComputacional = false)
{
  if (toComputacional) {
    inputText = text.toUpperCase();
    inputText = inputText.replace(/1/g, '1');
    inputText = inputText.replace(/0/g, '0');
    inputText = inputText.replace(/↔/g, '==');
    inputText = inputText.replace(/→/g, '==');
    inputText = inputText.replace(/∨/g, '||');
    inputText = inputText.replace(/∧/g, '&&');
    inputText = inputText.replace(/¬/g, '!');
  } else {
    inputText = text.toUpperCase();
    inputText = inputText.replace(/TRUE/g, '1');
    inputText = inputText.replace(/FALSE/g, '0');
    inputText = inputText.replace(/<->/g, '↔');
    inputText = inputText.replace(/->/g, '→');
    inputText = inputText.replace(/V/g, '∨');
    inputText = inputText.replace(/\^/g, '∧');
    inputText = inputText.replace(/!|~/g, '¬');
  }

  return inputText;
}

function isPontuation(currentChar, exact = false)
{
  if (exact) {
    return currentChar == exact;
  }
  return ['(', ')'].includes(currentChar);
}

function isBoolean(currentChar)
{
  return ['1', '0'].includes(currentChar);
}

function isPropositional(currentChar)
{
  return currentChar.match(/[A-Z]/) ? true : false;
}

function isConective(currentChar, except = false)
{
  let conectives = ['¬', '→', '↔', '∧', '∨'];
  if (except) {
    conectives.splice(conectives.indexOf(except), 1);
  }
  return conectives.includes(currentChar);
}

function customMessage(type, message)
{
  const random = Math.floor(Math.random() * 1000000) + 1;

  if($(".alert")[0] != undefined){
      $('.alert').fadeOut(500);
  }

  switch(type){
    case 'success': {
      $('.main-queue').append('<div class="mt-3 alert alert-success ' + random + '">' + message + '<hr><p class="mb-0 fnc"></p><hr><p class="mb-0 fnd"></p></div>');
      $('.' + random).click(function() {
        $('.' + random).fadeOut(500);
      });
      break;
    }
    case 'fail': {
      $('.main-queue').append('<div class="mt-3 alert alert-danger ' + random + '">' + message + '<hr><p class="mb-0 fnc"></p><hr><p class="mb-0 fnd"></p></div>');
      $('.' + random).click(function() {
        $('.' + random).fadeOut(500);
      });
      break;
    }
    default:
      $('.main-queue').append('<div class="mt-3 alert alert-info ' + random + '">' + message + '<hr><p class="mb-0 fnc"></p><hr><p class="mb-0 fnd"></p></div>');
      $('.' + random).click(function() {
        $('.' + random).fadeOut(500);
      });
      break;
  }
}

function generateTruthTable(inputText)
{
  clearTruthTable();

  $(".left-side-queue").show(500);

  let recognizedText = normalizeText(inputText, true);
  let recognizedArray = textToArray(recognizedText);
  let proposicionalsArray = [];

  for (i = 0; i < recognizedArray.length; i++) {
    if (isPropositional(recognizedArray[i])) {
      proposicionalsArray.push(recognizedArray[i]);
    }
  }

  proposicionalsArray = [...new Set(proposicionalsArray)];
  createTruthTableHead(proposicionalsArray, inputText);

  var row = [];

  for (var i = (Math.pow(2, proposicionalsArray.length) - 1) ; i >= 0 ; i--) {
    for (var j = (proposicionalsArray.length - 1) ; j >= 0 ; j--) {
      row[j] = (i & Math.pow(2,j)) ? 1 : 0
    }
    processTruthTableRow(row, proposicionalsArray, inputText);
  }

  fixNormalForms();

}

function fixNormalForms()
{
  const fnc_text = ($('.fnc').text()).replace(/\)\(/g, ') ∧ (');
  const fnd_text = ($('.fnd').text()).replace(/\)\(/g, ') ∨ (');

  $('.fnc').html('<b>Forma Normal Conjuntiva: </b><code>' + fnc_text + '</code>');
  $('.fnd').html('<b>Forma Normal Disjuntiva: </b><code>' + fnd_text + '</code>');
}

function processTruthTableRow(row, proposicionalsArray, inputText)
{

  for (var i = 0; i < proposicionalsArray.length; i++) {
    const match = new RegExp(`(\\b${proposicionalsArray[i]}\\b)`, 'gi');
    inputText = inputText.replace(match, row[i]);
  }

  const result = eval(normalizeText(inputText, true));
  createTruthTableBody(row, result);

  if (result == 'true' || result == 1) {
    createFND(row, proposicionalsArray, result);
  } else {
    createFNC(row, proposicionalsArray, result);
  }
}


function createFND(row, proposicionalsArray, result)
{
  resultString = $('.fnd').val();

  console.log("What is that: " + resultString);
  if (!resultString ||  resultString == undefined) {
    resultString += '(';
  } else {
    resultString += '∨(';
  }

  for (var i = 0; i < proposicionalsArray.length; i++) {

    let setAnd = '∧';

    if (i == proposicionalsArray.length - 1) {
      setAnd = '';
    }

    if (row[i] == 1) {
      resultString += proposicionalsArray[i] + setAnd;
    } else {
      resultString += '¬' + proposicionalsArray[i] + setAnd;
    }
  }

  resultString += ')';

  $('.fnd').append(resultString);

}


function createFNC(row, proposicionalsArray, result)
{
  resultString = $('.fnc').val();

  if (!resultString ||  resultString == undefined) {
    resultString += '(';
  } else {
    resultString += '∧(';
  }

  for (var i = 0; i < proposicionalsArray.length; i++) {

    let setOr = '∨';

    if (i == proposicionalsArray.length - 1) {
      setOr = '';
    }

    if (row[i] == 1) {
      resultString += proposicionalsArray[i] + setOr;
    } else {
      resultString += '¬' + proposicionalsArray[i] + setOr;
    }
  }

  resultString += ')';

  $('.fnc').append(resultString);

}

function clearTruthTable()
{
  $('.truth-table-head-tr').empty();
  $('.truth-table-body').empty();
  $('.fnc').empty();
  $('.fnd').empty();
}

function createTruthTableHead(proposicionalsArray, inputText)
{
  $(".truth-table").show(500);
  proposicionalsArray.forEach(propositional => {
    $('.truth-table-head-tr').append(
      '<th>' + propositional + '</th>'
    );
  });

  $('.truth-table-head-tr').append(
    '<th>' + inputText + '</th>'
  );
}

function createTruthTableBody(row, result)
{
  const random = Math.floor(Math.random() * 1000000) + 1;
  $(".truth-table-body").append('<tr class="truth-table-body-tr-' + random + '"></tr>');

  row.forEach(propositionalValue => {
    $('.truth-table-body-tr-' + random).append(
      '<td>' + propositionalValue + '</td>'
    );
  });

  $('.truth-table-body-tr-' + random).append(
    '<th>' + (result == 'true' || result == 1 ? '1' : '0') + '</th>'
  );
}

