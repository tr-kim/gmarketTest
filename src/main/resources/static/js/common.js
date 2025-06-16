window.addEventListener('load', function() {
    //메뉴 클릭
    if(document.querySelector('header')){
        const lis = document.querySelectorAll('header li');
        lis.forEach(li =>{
            li.addEventListener('click', function(){            
                lis.forEach(item => {
                    item.classList.remove('active');                
                })
                li.classList.add('active');
            })
        })
        const sendmenu = document.querySelector('.gnb .sendmenu');
        sendmenu.addEventListener('click', function() {
            sendmenu.querySelector('ul').classList.toggle('d-flex');
        })   
    }    
    if(document.querySelector('aside')){
        const lis = document.querySelectorAll('aside .gnb li');
        lis.forEach(li =>{
            li.addEventListener('click', function(){            
                lis.forEach(item => {
                    item.classList.remove('active');                
                })
                li.classList.add('active');
            })
        })         
    }
})