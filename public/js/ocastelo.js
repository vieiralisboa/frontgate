//JavaScript

$('#notice').fadeIn("slow");

// clear notice after 5 seconds
setTimeout(function(){
    $('#notice').fadeOut("slow", function(){
        $(this).find('a').text('');
    });
}, 5000);

// set info email link
$("#contact").attr("href", ['mail', 'to:', 'ocastelo', '@', 'medorc', '.pt', '?', 'Subject','=O Castelo'].join(''));

// set email link
$("#e-mail").click(function(){
    var email = ['ocastelo', '@', 'medorc', '.pt'].join('');
    if($(this).text() == "Queres o castelo.pt?"){
        var subject = 'Oferta%20pelo%20Castelo';
        var body = 'Oferta superior a 900 Euros:';
        $(this)
        .text(email)
        .attr("href", "mailto:" + email + '?Subject=' + subject + '&Body=' + body);
        return false;
    } 
});

/*/ Gmail
$("#contact").click(function(){
    var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
              '&to=' + ['info', '@', 'medorc', '.org'].join('') +
              '&su=' + 'Medorc Project' +
              '&body=' + 'Write the body of your message here' +
              '&ui=1';
    location.href = str;
});//*/