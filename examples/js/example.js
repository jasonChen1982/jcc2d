/* global $:true, EXAMPLES:true, stroll */

var list = '';
for (var i = 0; i < EXAMPLES.length; i++) {
    var item = EXAMPLES[i];
    list += '<li class="demo-item" data-url="'+item.link+'">'+item.title+'</li>';
}

$('#listBox').html(list);
$('#listBox li').on('click',function(){
    if (this.dataset.url) {
        document.getElementById('viewPort').src = this.dataset.url;
    }
});

$('#sideBox').on('mouseover',function() {
    $(document.body).addClass('active-window');
});
$('#sideBox').on('mouseout',function() {
    $(document.body).removeClass('active-window');
});

$('#sideBox').on('click',function() {
    $(document.body).addClass('active-window');
});
$('#center-view-box').on('click',function() {
    $(document.body).removeClass('active-window');
});

stroll.bind( $( '.demo-list-box' ) );
