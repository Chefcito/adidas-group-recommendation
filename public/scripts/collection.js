window.addEventListener('load', function(){
    var adidasCollection = document.querySelectorAll('.card__container__t-shirt');
    var seletedItemId;

    adidasCollection.forEach(function (elem) {
        elem.addEventListener('click', function() {
            selectItem(elem.getAttribute('data-id') );
        });
    });

    function selectItem(selectedItemId) {
        fetch(`/api/selectItem`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: `id=${selectedItemId}`,
        }).then(function(response){
            return response.json();
        }).catch(function(err){
            console.error(err);
        }).then(function(response){
            console.log(response);
            goToItemDescription();
        });
    }

    function goToItemDescription() {
        window.location.href = "/item";
    }
});