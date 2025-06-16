window.addEventListener('load', function() {
    //메뉴 클릭
    if (document.querySelector('header')) {
        const lis = document.querySelectorAll('header li');
        const sendmenu = document.querySelector('.gnb .sendmenu');
        const sendmenuUl = sendmenu.querySelector('ul');

        lis.forEach(li => {
            li.addEventListener('click', function () {
                lis.forEach(item => {
                    item.classList.remove('active');
                });
                li.classList.add('active');
            });
        });

        sendmenu.addEventListener('click', function (e) {
            e.stopPropagation(); // 클릭 이벤트 전파 막기
            sendmenuUl.classList.toggle('d-flex');
        });

        // sendmenu 외의 영역 클릭 시 메뉴 닫기
        document.addEventListener('click', function (e) {
            if (!sendmenu.contains(e.target)) {
                sendmenuUl.classList.remove('d-flex');
            }
        });
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