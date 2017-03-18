const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vel ipsum id nibh bibendum mollis. Mauris eget consectetur mauris. Vivamus sagittis mollis tempus. Vestibulum luctus accumsan turpis, vitae tincidunt eros ultrices id. Quisque pellentesque lacinia tempor. Donec dignissim in est eget ultricies. Suspendisse potenti.

Quisque vulputate enim nisi, nec posuere quam fringilla a. Nulla quis felis non lorem tempus mattis vel a risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam consequat aliquet nisi, ut blandit arcu maximus sit amet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas id orci a arcu facilisis varius. Morbi maximus volutpat sapien, eget sollicitudin metus.

Vestibulum id justo tempor libero ultricies feugiat in a mauris. Donec hendrerit eget ipsum non ornare. Vestibulum ac euismod diam. Aliquam bibendum orci felis, id cursus tellus placerat id. Fusce commodo tortor aliquet, mollis libero eu, sagittis magna. Mauris suscipit urna sed vulputate elementum. Nullam sit amet neque ac sem tincidunt auctor. Cras in ultrices ligula. Maecenas sodales nunc eget nisi placerat, at pulvinar justo elementum. Suspendisse at nisi sed massa luctus pharetra vel at libero. Donec id leo sed sapien suscipit congue. Aenean id quam in sem fermentum convallis. Vestibulum nec lectus urna. Cras consectetur massa at diam finibus, et dictum massa auctor. Vivamus non arcu dui.

Cras et dolor vitae nulla viverra pulvinar a id ante. Fusce at varius neque, id aliquet augue. Vivamus nec arcu posuere, dapibus nunc a, egestas elit. In vestibulum mauris a odio auctor auctor. Donec commodo nunc eu orci venenatis pharetra. Proin eu lacus iaculis est vulputate rhoncus id nec velit. Nulla quam urna, aliquet ut orci id, feugiat finibus nisi. Sed urna urna, efficitur at risus ut, fringilla placerat odio. Donec non nisi sed odio suscipit auctor. Ut quis est vel arcu viverra tempor. Integer lacus purus, sodales a bibendum non, blandit at eros. Fusce ultricies magna non tincidunt consequat. Nam in tincidunt dolor. Mauris vulputate nisl diam, vel fringilla mi vehicula id.

Morbi faucibus condimentum feugiat. Suspendisse potenti. Donec vulputate vulputate odio, at tempor est ullamcorper non. Curabitur ornare varius est, sed mattis dolor ultrices nec. Maecenas eu luctus eros, sed sagittis nulla. Etiam arcu nulla, porttitor non tempus a, volutpat ut tortor. Aenean porttitor magna et arcu maximus auctor. Vivamus finibus enim non eros lacinia, tristique pretium ante varius. Sed semper venenatis odio sed rhoncus. Sed in tortor nibh. Maecenas tempor magna id tortor euismod efficitur. Donec eget ante mauris. Vivamus dictum euismod justo vitae laoreet. Donec volutpat ligula condimentum tortor malesuada, eget fringilla lectus sodales. Donec tincidunt nulla sed turpis pretium posuere. Praesent posuere arcu ut viverra varius.`

function random(max){
    return Math.floor(Math.random()*(max)+1)
}
function userOrNull(){
    const retVal = (random(10) -1) || 'NULL'
    return retVal;

}
function generateTask(){
    const sql = 'INSERT INTO tasks (taskTypeId,productId,envId,requesterId,priorityId,open_date,exec_date,statusId,qaGO,rollBack,urgent,additionalInfo,assigneeId,resolved_by_Id)'+
        ' VALUES (' +
        `${random(2)}, ${random(2)}, ${random(2)}, ${random(9)},` +
        `${random(4)}, '2017-0${random(9)}-${random(2)}${random(9)}', '2018-0${random(9)}-${random(2)}${random(9)}',`+
        `${random(5)}, 1, 1, 0, `+
        `'${lorem.substr(random(100)-1, random(100)+100)}', ${userOrNull()}, ${userOrNull()});`
    console.log(sql);
}
for(var i = 0; i < 200; i++){
    generateTask()
}

//INSERT INTO tasks
// (taskTypeId,productId,envId,requesterId,priorityId,open_date,exec_date,statusId,qaGO,rollBack,urgent,additionalInfo,assigneeId,resolved_by_Id)
// (2         , 1       , 2   , 8         ,3, '2017-08-16', '2018-09-14',4, 1, 1, 0, NULL, NULL, NULL);

//`statusId,qaGO,rollBack,urgent,additionalInfo,assigneeId,resolved_by_Id)`+