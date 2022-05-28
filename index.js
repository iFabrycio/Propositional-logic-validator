$( document ).ready(function (){
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

function appendToInput(append)
{
  $('#input').val($('#input').val() + append);
}

function validate()
{
  inputText = normalizeText($('#input').val());

  console.log(inputText);

  inputArray = inputText.split('');

  let openPontuation = false;
  let canBePropositional = true;
  for(i = 0; i < inputArray.length; i++) {

    if (!isBoolean(inputArray[i]) && !isConective(inputArray[i])
      && !isPontuation(inputArray[i]) && !isPropositional(inputArray[i])) {
        customMessage('fail', inputArray[i] + ' não é um caractere válido.');
        return;
      }

    if (
      (i == 0 && isConective(inputArray[i], '¬')) ||
      (i == inputArray.length - 1 && isConective(inputArray[i]))
      ) {
      customMessage('fail', 'Inválido, conectivos em posições inválidas');
      return;
    }

    if (canBePropositional && isPropositional(inputArray[i])) {
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
  }

  if(openPontuation) {
    customMessage('fail', 'Inválido, Pontuação aberta');
    return;
  }

  customMessage('success', inputText + ' é uma lógica proposicional válida!');
  return;
}

function normalizeText(text)
{
  inputText = text.toUpperCase();
  inputText = inputText.replace(/TRUE/g, '1');
  inputText = inputText.replace(/FALSE/g, '0');
  inputText = inputText.replace(/<->/g, '↔');
  inputText = inputText.replace(/->/g, '→');
  inputText = inputText.replace(/V/g, '∨');
  inputText = inputText.replace(/\^/g, '∧');
  inputText = inputText.replace(/!|~/g, '¬');

  return inputText;
}

function isPontuation(currentChar)
{
  return ['(', ')'].includes(currentChar);
}

function isBoolean(currentChar)
{
  return ['1', '0'].includes(currentChar);
}

function isPropositional(currentChar)
{
  return currentChar.match(/[A-Z]/);
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
  switch(type){
    case 'success': {
      $('.main-queue').append('<div class="mt-3 alert alert-success">' + message + '</div>');
      $('.alert').fadeOut(5000);
      break;
    }
    case 'fail': {
      $('.main-queue').append('<div class="mt-3 alert alert-danger">' + message + '</div>');
      $('.alert').fadeOut(5000);
      break;
    }
    default:
      $('.main-queue').append('<div class="mt-3 alert alert-info">' + message + '</div>');
      $('.alert').fadeOut(5000);
      break;
  }
}
