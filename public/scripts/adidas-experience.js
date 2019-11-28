window.addEventListener('load', function(){
    var kInput = document.querySelector('.entry__container__info__container__input');
    var kNumber = kInput.value;

    var shirtCards = document.querySelectorAll('.card__container__p');

    kInput.addEventListener('input', function(){
        if(isNaN(kInput.value)) {
            console.log(kInput.value + " no es un número");
        } else {
            kNumber = kInput.value;
            shirtCards.forEach(function(elem, index) {
                if(index > kNumber-1) {
                    
                }
            });
            //shirtCards[kNumber].parentNode.removeChild(shirtCards[kNumber]);
        }
    });

    // var alternativesData = document.querySelector('#alternatives').getAttribute('data-alternatives');
    // console.log(alternativesData);

    /* kInput.addEventListener('input', function(){
        if(isNaN(kInput.value)) {
            console.log(kInput.value + " no es un número");
        } else {
            kNumber = kInput.value;
            updateAlternatives(kNumber);
        }
    });

    function updateAlternatives(k) {
        fetch(`/api/updateAlternatives`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: `k=${k}`,
        }).then(function(response){
            return response.text();
        }).catch(function(err){
            console.error(err);
        }).then(function(response){
            console.log(response);
        });
    } */
});