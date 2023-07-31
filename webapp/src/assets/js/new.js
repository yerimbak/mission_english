// mission english tab
const $tabBg = document.querySelector('.tab-wrap .bg');
const $tabCont = document.querySelectorAll('.tab-cont');
const $tab = document.querySelectorAll('.tab-wrap:not(.type-line) .tab');
if ($tab) {
  $tab.forEach(function(element, index){
    element.addEventListener('click', function(){
      for (let i = 0; i < $tab.length; i++) {
        $tab[i].classList.remove('on')
        $tabCont[i].classList.remove('on')
      }
      element.classList.add('on');
      $tabBg.style.left = $tab[index].offsetLeft + 'px'
      $tabCont[index].classList.add('on');
    });
  });
}


const $btnTooltip = document.querySelectorAll('.btn-hint');
if  ($btnTooltip) {
  $btnTooltip.forEach(function(element, index){
    element.addEventListener('click', function(){
      if (element.parentElement.classList.contains('on')) {
        element.parentElement.classList.remove('on');
        element.innerHTML = '힌트보기'
      } else {
        element.parentElement.classList.add('on')
        element.innerHTML = ''
      }
    });
  });
}
if (document.querySelectorAll('.hint-box')) {
  document.querySelectorAll('.hint-box').forEach(function(element){
    let num = 0;
    for (let i = 0; i < element.children.length; i++) {
      element.children[i].style.animationDelay = '0.'+(num+=1) +'s';
    }
  })
}

// bookmark event
document.querySelectorAll('.btn-bookmark').forEach(function(element){
  element.addEventListener('click', function(){
    if (element.classList.contains('on')) {
      element.classList.remove('on');
    } else {
      element.classList.add('on');
    }
  });
});

// play event
document.querySelectorAll('.btn-stop').forEach(function(element){
  element.addEventListener('click', function(e){
    const _eventName = element.getAttribute('data-playing')

    if (element.classList.contains('on')) {
      element.classList.remove('on');
      stopProgressBar(_eventName)
    } else {
      element.classList.add('on');
      moveProgressBar(_eventName);
    }
  });
});
 
//reset event
document.querySelectorAll('.btn-reset').forEach(function(element){
  element.addEventListener('click', function(e){
    const _eventName = element.getAttribute('data-refresh')
    resetProgressBar(_eventName);
  });
});

const $bgDig = document.querySelector('.bg-dim');
// bottomsheet event
document.querySelectorAll('.btn-botsheet-open').forEach(function(element){
  element.addEventListener('click', function(){
    element.style.display = 'none';
    if (!element.classList.contains('on')) {
      const $bottomSheet = document.getElementById(element.getAttribute('data-bottomSheet'))
      $bottomSheet.style.opacity = 0;
      $bottomSheet.style.display = 'block';
      $bottomSheet.style.bottom = $bottomSheet.offsetHeight * -1 + 'px';

      setTimeout (function(){
        $bottomSheet.style.opacity = 1;
        $bottomSheet.style.bottom = 0;
      },200)

      element.classList.add('on');
      $bgDig.classList.add('on');
    } else {
      return false;
    }
  });
});
document.querySelectorAll('.btn-botsheet-close').forEach(function(element){
  element.addEventListener('click', function(){
    const $bottomSheet = document.getElementById(element.getAttribute('data-bottomSheet'))
    $bottomSheet.style.bottom = $bottomSheet.offsetHeight * -1 + 'px';

    setTimeout (function(){
      $bottomSheet.style.opacity = 0;
      $bottomSheet.style.display = 'none';
    },200)
   
    // 220714 : 랜딩 추가 | 오픈버튼없는 경우 에러문구로 인해 수정
    if (document.querySelector('.btn-botsheet-open[data-bottomSheet="'+element.getAttribute('data-bottomSheet')+'"]')) {
      document.querySelector('.btn-botsheet-open[data-bottomSheet="'+element.getAttribute('data-bottomSheet')+'"]').classList.remove('on')
      document.querySelector('.btn-botsheet-open[data-bottomSheet="'+element.getAttribute('data-bottomSheet')+'"]').style.display = 'block';
    }
    $bgDig.classList.remove('on');
  });
});



// 스크롤 이벤트
const $btnTopScr = document.querySelector('.btn-top');
// 220524 변경  const $tabWrap = document.querySelector('.tab-wrap'); - > const $tabWrap = document.querySelector('.tab-wrap');
const $tabArea = document.querySelector('.tab-area');
const $tabWrap = document.querySelector('.tab-wrap');
const missionHeaderH = document.querySelector('.header.type-mission') ? document.querySelector('.header.type-mission').offsetHeight : null; // 220714 : 랜딩 추가 | 없는경우 오류문구로 인해 수정
let beforePosition = document.documentElement.scrollTop;

// 220525 추가 헤더 영역에 맞춰서
// 싱크 관련 제거 - 손상만 0613
// if ($tabArea) {
//   $tabWrap.style.top = $tabArea.offsetTop + 20 +'px'
// }

const checkScroll=()=>{
  // 상단으로 이동 버튼
  if(window.pageYOffset >= missionHeaderH){  // 높이 수정 필요 // 220525 높이값 헤더높이로 우선 수정
      $btnTopScr.classList.add('show');  
  }else{
      $btnTopScr.classList.remove('show'); 
  }
  // 탭 스크롤 이동시 show&hide
  let afterPosition = document.documentElement.scrollTop;
  if ($tabWrap && window.scrollY + missionHeaderH >= $tabWrap.offsetTop) {
    if(beforePosition < afterPosition ){
      if (!$tabWrap.classList.contains('hide')) {
        $tabWrap.classList.add('hide');
      }

    } else {
      if ($tabWrap.classList.contains('hide')) {
        $tabWrap.classList.remove('hide');
        $tabWrap.classList.remove('show');
      }
    }
    beforePosition = afterPosition;
  }
}

const moveToTop=()=>{
  if(window.pageYOffset > 0 ){
    window.scrollTo({top:0, behavior:"smooth"});
  }
}
if ($btnTopScr) {
  window.addEventListener('scroll', checkScroll);
  $btnTopScr.addEventListener('click',moveToTop);
}



// progress bar
let progressTimer = null;
let curWidth = 0;
let leftTimer = 0;
const moveProgressBar=(eventName) => {
  
  const $progress = document.querySelector('[data-progress="'+eventName+'"]')
  const _timer = Number($progress.getAttribute('data-timer'));
  if ($progress.children[0].offsetWidth != $progress.offsetWidth) {
    $progress.children[0].style.width = 0;
    leftTimer = _timer / (100 / (100 - curWidth));
    $progress.children[0].style.transitionDuration   = (_timer - leftTimer) +'s';
    progressTimer = setTimeout(function(){
      // 시간 다 채우면 callback
      resetProgressBar(eventName)
    }, ((_timer - leftTimer)*1000+500))
  } else {
    $progress.children[0].style.width = 0;
    $progress.children[0].style.transitionDuration   = _timer +'s';
    progressTimer = setTimeout(function(){
      // 시간 다 채우면 callback
      resetProgressBar(eventName)
    }, (_timer*1000+500))
  }
}
const stopProgressBar=(eventName) => {
  clearTimeout(progressTimer);
  const $progress = document.querySelector('[data-progress="'+eventName+'"]')
  const _timer = $progress.getAttribute('data-timer');
  // curWidth = Math.round($progress.children[0].offsetWidth/ $progress.offsetWidth * 100);
  curWidth = $progress.children[0].offsetWidth/ $progress.offsetWidth * 100;
  progressTimer =  setTimeout(function(){
    $progress.children[0].style.width = curWidth +'%';
    $progress.children[0].style.transitionDuration   = '0s';
  })
}

// 대화 리셋 버튼
const resetProgressBar= (eventName) => {
  const $progress = document.querySelector('[data-progress="'+eventName+'"]');
  document.querySelector('[data-playing="'+eventName+'"]').classList.remove('on')
  $progress.children[0].style.width = '100%';
  $progress.children[0].style.transitionDuration = '0s';
}

// modal event
if (document.querySelectorAll('.open-popup')){
  document.querySelectorAll('.open-popup').forEach(function(element){
    element.addEventListener('click', function(){
      const $modal = document.getElementById(element.dataset.modalName);
      let _dim = document.createElement('div');
      document.querySelector('body').style.overflow = "hidden"
      _dim.classList.add('bg-dim', 'modal');
      document.querySelector('.app-inner').prepend(_dim);
      _dim.style.display = 'block'
      $modal.classList.add('show');
    });
  });
}

// modal event close
const modalClose=() => {
  const _modalWrap = document.querySelector('.modal-wrap.show');
  if (_modalWrap.offsetWidth > 0){
    _modalWrap.classList.add('hide');
    _modalWrap.classList.remove('show');
    document.querySelector('.bg-dim').classList.add('hide');
    setTimeout(function(){
      document.querySelector('.bg-dim').remove();
      _modalWrap.classList.remove('hide')
    },500)
  }
  document.querySelector('body').style.removeProperty('overflow')
  
}




/* 버튼 변경 코드 */
const _UI = {
  Async: {
    wait(ms, value) {
      return new Promise((resolve) => setTimeout(resolve, ms, value))
    },
    promise(callback) {
      return new Promise((resolve, reject) => {
        callback(resolve, reject)
      })
    },
    Run(gen) {
      const iter = gen()
      ;(function iterate({value, done}) {
        if (done) return value
        if (value.constructor === Promise) {
          value.then((data) => iterate(iter.next(data))).catch((err) => iter.throw(err))
        } else {
          iterate(iter.next(value))
        }
      })(iter.next())
    }
  }
};

let clickFlag = false
if (document.querySelector('.changeBt')){
  document.querySelector('.changeBt').addEventListener('click', (e) => {
    if( clickFlag ) return
    clickFlag = true
    const target = document.getElementById('testChange')
    const delayTime = 500
    _UI.Async.Run(function* () {
      console.log('!!!!!!!!!!!!start')  
      for (let i = 10; i > 2; i--) {
        target.classList.add(`pd${i-1}`)
        target.classList.remove(`pd${i}`)
        yield _UI.Async.wait(delayTime)
      }
      console.log('end!!!!!!!!!!!!')
      clickFlag = false
    })
  })
}



if (document.querySelectorAll('.listening-box .after span')) {
  document.querySelectorAll('.listening-box .after span').forEach(function(element,index){
    const _duration = Number(element.dataset.duration);
    const _delay = Number(element.dataset.delay);
    let _text = document.createElement('em');
    _text.classList.add('inner-text')
    _text.innerHTML = element.innerHTML;
    _text.style.animationDuration = _duration + 's';
    element.appendChild(_text); 
  })
}

// VH 추가
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);




// 220530 추가 : 보딩화면 컨텐츠 높이값 관련 
if (document.querySelector('.content.type-bording')){
  document.querySelector('body').style.overflow = "hidden";
  //document.querySelector('.btn-top').style.display = "none";
} else {
  document.querySelector('body').style.overflow = "";
}


// 220907 추가 : 약관 전체 선택
var checkAll = document.querySelector('#checkAll');
if(checkAll) {
  var chkbox = document.querySelectorAll('.chk');
  checkAll.onclick = function(){
    if(checkAll.checked == false){
      for(var i=0; i<chkbox.length; i++){ chkbox[i].checked = false; }
    }else{
      for(var i=0; i<chkbox.length; i++){ chkbox[i].checked = true; }
    }
  };
  for(var i=0; i<chkbox.length; i++){
    chkbox[i].onclick = function(){
      if( this.checked == false ){ checkAll.checked = false; }
    }
  }
}
// 221012 추가 : 약관 그룹 전체 선택
var checkGroupAll = document.querySelector('#checkGroupAll');
if(checkGroupAll) {
  var checkGroup = document.querySelectorAll('.chk-group');
  checkGroupAll.onclick = function(){
    if(checkGroupAll.checked == false){
      for(var i=0; i<checkGroup.length; i++){ checkGroup[i].checked = false; }
    }else{
      for(var i=0; i<checkGroup.length; i++){ checkGroup[i].checked = true; }
    }
  };
  for(var i=0; i<checkGroup.length; i++){
    checkGroup[i].onclick = function(){
      if( this.checked == false ){ checkGroupAll.checked = false; }
    }
  }
}

// 약관 팝업
if(document.querySelector('#termsPop')) {
  const popupBtn = document.querySelectorAll('.open-popup');
  popupBtn.forEach(function(element,index){
    element.addEventListener('click',function(){
      modalTabCont(index);
		// 해당 탭 클릭
		document.querySelectorAll('.tab-wrap.type-line .tab')[index].click();
    })
  })

  function modalTabCont(num) {
		// 초기 탭 bar의 크기와 위치
    const _bg = document.querySelector('.tab-wrap.type-line .bg');
    const tabBtns = document.querySelectorAll('.tab-wrap.type-line .tab')
    const tabConts = document.querySelectorAll('.tab-wrap.type-line + .tab-cont-wrap .tab-cont')
		_bg.style.width = tabBtns[num].offsetWidth + 'px';
		_bg.style.left = tabBtns[num].offsetLeft + 'px';


		let paddingValue = document.defaultView.getComputedStyle(tabBtns[num]).getPropertyValue("padding-left");
		paddingValue = parseInt(paddingValue, 10);

		let arr = [];

    tabBtns.forEach(function (element,idx) {
			// 각 탭의 x좌표 절대값 - padding-left
			const posX = element.offsetLeft - paddingValue; 
			arr.push(posX);
      element.addEventListener('click', function(){
				// 탭 클릭시 bar의 크기와 위치 변경
				const dataTab = element.parentElement.dataset.tab;
				const _thisTabs = document.querySelectorAll('.tab-wrap[data-tab="' + dataTab + '"] .tab');
				const _bg = element.parentElement.firstElementChild;
				_bg.style.left = element.offsetLeft + 'px';
				_bg.style.width = element.offsetWidth + 'px';
				_bg.style.transition = 0.1 * (_thisTabs.length) + 's'
				
				// 해당 탭 위치로 x 스크롤
				element.parentElement.scroll({
				  top:0,
				  left: arr[idx],
				  behavior: 'smooth'
				})
          
        for (let i = 0; i < tabBtns.length; i++) {
          tabBtns[i].classList.remove('on')
          tabConts[i].classList.remove('on')
        }
        this.classList.add('on');
        tabConts[idx].classList.add('on');
			})
    })
  }

}