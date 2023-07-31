
if(document.querySelector('.scrollWrap')){
    var scrollElement = document.querySelector('.scrollWrap');
    
    scrollElement.addEventListener('scroll', function(){
        if(document.querySelector('.btn-scrollTop')){
            checkScrollTop(this)
        }        
    })
}

// 최상단으로 버튼 (btn-scrollTop)
if(document.querySelector('.btn-scrollTop')){
    document.querySelector('.btn-scrollTop').addEventListener('click', function(){
        scrollToTop(150);
    })    
}

// scrollToTop animation
function scrollToTop (duration) {
    // cancel if already on top
    if (scrollElement.scrollTop === 0) return;

    const totalScrollDistance = scrollElement.scrollTop;
    let scrollY = totalScrollDistance, oldTimestamp = null;

    function step (newTimestamp) {
        if (oldTimestamp !== null) {
            // if duration is 0 scrollY will be -Infinity
            scrollY -= totalScrollDistance * (newTimestamp - oldTimestamp) / duration;
            if (scrollY <= 0) return scrollElement.scrollTop = 0;
            scrollElement.scrollTop = scrollY;
        }
        oldTimestamp = newTimestamp;
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
}


// check scrollTop + button show/hide
function checkScrollTop (el){
    var el_scrollTop = el.scrollTop;
    var btn_scrollTop = document.querySelector('.btn-scrollTop');

    if(el_scrollTop >= 800){
        btn_scrollTop.classList.add('on');

        setTimeout(function(){
            btn_scrollTop.setAttribute('style', 'opacity:1');
        }, 1)
    }else {
        btn_scrollTop.setAttribute('style', 'opacity:0');

        setTimeout(function(){
            btn_scrollTop.classList.remove('on');
        }, 150)
    }
}



// wordBlank
const wordBlankAll = document.querySelectorAll('#wordBlank *');
const wordBlank = document.querySelectorAll('#wordBlank .blank');
const selectWord = document.querySelectorAll('#wordBlankWord ul li');
let blankFocus = document.querySelector('#wordBlank .blank.focus');

// 하단 버튼들 인덱스 생성
function selectWordSetNum() {
    selectWord.forEach(function(item, index){
        item.dataset.num = index;
    });
}
selectWordSetNum();

// 하단 버튼 선택
function selectWordItem() {
    const itemIndex = this.dataset.num;
    const itemText = this.textContent;

    // 이미 선택된거면 / focus 된게 없으면
    if(this.classList.contains('selected') || document.querySelector('#wordBlank .blank.focus') == null){
        return false;
    }

    this.classList.add('selected');

    setWordBlank(itemText, itemIndex);
}
selectWord.forEach(item => item.addEventListener('click', selectWordItem));

// 상단 포커스에 단어 삽입
function setWordBlank(itemText, itemIndex) {
    blankFocus.dataset.num = itemIndex;
    blankFocus.textContent = itemText;
    blankFocus.classList.remove('focus');
    blankFocus.classList.add('fill');

    findNextEmptyBlank(blankFocus);            
}

// 다음 blank 찾기
function findNextEmptyBlank(item) {
    
    const blankIndex = Array.prototype.indexOf.call(item.parentNode.children, item);

    for(let i = blankIndex + 1; i < wordBlankAll.length; i++){
        if(wordBlankAll[i].classList.contains('blank') && !wordBlankAll[i].classList.contains('fill')){
            wordBlankAll[i].classList.add('focus');                   
            setBlankFocus(wordBlankAll[i]);   
            return false;
        }
    }
}

// 상단 박스 선택해서 단어 삭제
function deleteWordBlank(itemText, itemIndex) { 
    setBlankFocus(this);
    wordBlank.forEach(item => item.classList.remove('focus'));
    this.classList.add('focus'); 
    
    // 이미 단어가 채워져서 fill 클래스가 있을때만
    if(this.classList.contains('fill')){
        deleteDataNumMatching(blankFocus);
        this.classList.remove('fill');
        this.textContent = "";
    }
}
wordBlank.forEach(item => item.addEventListener('click', deleteWordBlank));

// 위의 박스와 아래박스의 연결data 매칭 삭제
function deleteDataNumMatching(blankFocus){
    const selectWordDataNumMatching = document.querySelector('#wordBlankWord ul li[data-num="'+ blankFocus.dataset.num + '"]');         
    blankFocus.dataset.num = "";
    selectWordDataNumMatching.classList.remove('selected');   
}

// blankFocus 설정
function setBlankFocus(item) {
    blankFocus = item;
}