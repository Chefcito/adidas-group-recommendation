window.addEventListener('load', function(){
    var usersDropdown = document.querySelector('.users-dropdown');
    var selectedUserId = usersDropdown.value;

    usersDropdown.addEventListener('change', function(){
        selectedUserId = usersDropdown.value;
        console.log(selectedUserId);
    });
    

    var startButton =   document.querySelector('.start-button');
    startButton.addEventListener('click', function(){
        selectUser(selectedUserId);
    });

    function selectUser(selectedUserId) {
        fetch(`/api/selectUser`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: `userId=${selectedUserId}`,
        }).then(function(response){
            return response.text();
        }).catch(function(err){
            console.error(err);
        }).then(function(message){
            console.log(message);
            goToAdidasExperience();
        });
    }

    function goToAdidasExperience() {
        window.location.href = "/adidas-experience";
    }
});