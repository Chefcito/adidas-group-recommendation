window.addEventListener('load', function(){
    var usersDropdown = document.querySelector('.user-selection__container__wrap__select');
    var selectedUserId = usersDropdown.value;

    usersDropdown.addEventListener('change', function(){
        selectedUserId = usersDropdown.value;
        console.log(selectedUserId);
    });

    var kInput = document.querySelector('.entry__container__info__container__input');
    var kNumber = kInput.value; 

    kInput.addEventListener('input', function(){
        if(isNaN(kInput.value)) {
            console.log(kInput.value + " no es un número");
        } else {
            kNumber = kInput.value;
        }
    });

    var startButton = document.querySelector('.user-selection__container__wrap__button');
    startButton.addEventListener('click', function(){
        if(selectedUserId != "default"){
            selectUser(selectedUserId);
        }
    });

    function selectUser(selectedUserId) {
        fetch(`/api/selectUser`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: `id=${selectedUserId}&k=${kNumber}`,
        }).then(function(response){
            return response.json();
        }).catch(function(err){
            console.error(err);
        }).then(function(response){
            console.log(response);
            goToAdidasExperience();
        });
    }

    function goToAdidasExperience() {
        window.location.href = "/adidas-experience";
    }
});