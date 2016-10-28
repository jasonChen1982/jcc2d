/* global $:true, EXAMPLES:true, stroll */

var list = '';
for (var i = 0; i < EXAMPLES.length; i++) {
    var item = EXAMPLES[i];
    list += '<li class="demo-item" data-url="'+item.link+'"><a href="demo_frames_sprite" target="viewPort">'+item.title+'</a></li>';
}

$('#listBox').html(list);
$('#listBox li').on('click',function(){
    if (this.dataset.url) {
        // document.getElementById('viewPort').src = location.href + this.dataset.url;
        // var link = document.createElement( 'a' );
        // link.className = 'link';
        // link.textContent = name;
        // link.href = location.href + this.dataset.url;
        // link.setAttribute( 'target', 'viewPort' );
        // link.click();
    }
});

$('#sideBox').on('mouseover',function() {
    $('#windowBox').addClass('active-window');
});
$('#sideBox').on('mouseout',function() {
    $('#windowBox').removeClass('active-window');
});

$('#sideBox').on('click',function() {
    $('#windowBox').addClass('active-window');
});
$('#center-view-box').on('click',function() {
    $('#windowBox').removeClass('active-window');
});

stroll.bind( $( '.demo-list-box' ) );
