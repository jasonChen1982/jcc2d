/* global $:true, EXAMPLES:true, stroll */

var list = '';
for (var i = 0; i < EXAMPLES.length; i++) {
    var item = EXAMPLES[i];
    list += '<li class="demo-item" data-url="'+(item.link ? item.link : '')+'">'+item.title+'</li>';
}

$('#listBox').html(list);

$('#listBox').on('click','.demo-item',function() {
    if (this.dataset.url) {
        $('#viewPort').attr('src', this.dataset.url);
        location.hash = this.dataset.url+'/index.html';
    }
});
$(window).on('load', function() {
    var hash = 'demo_graphics_particle';
    if (location.hash) hash = location.hash.substring(1);
    $('#viewPort').attr('src', hash+'/index.html');
});

$('#sideBox').on('mouseover',function() {
    $('#windowBox').addClass('active-window');
});
$('#sideBox').on('mouseout',function() {
    $('#windowBox').removeClass('active-window');
});

$('#sideBox').on('touchend',function() {
    $('#windowBox').addClass('active-window');
});
$('.center-view-box').on('touchend',function() {
    $('#windowBox').removeClass('active-window');
});

$('#openOther').on('click', function(){
    var hash = 'demo_graphics_particle';
    if (location.hash) hash = location.hash.substring(1);
    this.href = hash+'/index.html';
});

stroll.bind( $( '#listBox' ) );
