/**
 * Created by davidsu on 04/02/2017.
 */
$('#getUsers').click(()=>{
    $.get('users', (data, status) => {
        $('#response').text(data)
    })
})
