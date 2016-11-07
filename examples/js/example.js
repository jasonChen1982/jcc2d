/* global $:true, EXAMPLES:true, stroll */

var list = '';
for (var i = 0; i < EXAMPLES.length; i++) {
    var item = EXAMPLES[i];
    list += '<li class="demo-item"><a href="'+item.link+'/index.html" target="viewPort">'+item.title+'</a></li>';
}

$('#listBox').html(list);

$('#sideBox').on('mouseover',function() {
    $('#windowBox').addClass('active-window');
});
$('#sideBox').on('mouseout',function() {
    $('#windowBox').removeClass('active-window');
});

$('#sideBox').on('touchend',function() {
    console.log(111);
    $('#windowBox').addClass('active-window');
});
$('.center-view-box').on('touchend',function() {
    $('#windowBox').removeClass('active-window');
});

stroll.bind( $( '.demo-list-box' ) );
