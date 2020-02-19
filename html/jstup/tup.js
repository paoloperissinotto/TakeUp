
//var geometryCsg    = THREE.CSG.toCSG(geometryThree);
//var geometryThree  = THREE.CSG.fromCSG(geometryCsg);
/* var zpl = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
var zPlane=new THREE.Mesh(zpl,new THREE.MeshPhongMaterial( { side: THREE.DoubleSide ,color:0xfafe23} ));
 */
var geoplz = new THREE.PlaneBufferGeometry( 200, 200, 1 );
var matplz = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
var zPlane = new THREE.Mesh( geoplz, matplz );
var idanimation=undefined;
var objects=[];
// Our Javascript will go here.
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
/*  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube ); */
var size = 1000;
var divisions = 100;
var grid = new THREE.GridHelper( size, divisions );
grid.geometry.rotateX( Math.PI / 2 );
scene.add( grid );
grid.HID='GRID_'+generateID();

grid.DESCRIZIONE='GRID';
grid.TIPO="GRID";
Risorsa.registerElement(grid);

camera.position.z = 5;
//var map = new THREE.TextureLoader().load( "disegni/cover2.png" );
//var map = new THREE.TextureLoader().load( "disegni/cover2vera.png" );
var map = new THREE.TextureLoader().load( "disegni/Cover4.png" );
var material2 = new THREE.SpriteMaterial( { map: map, color: 0xffffff , opacity: 0.5,
    transparent: true} );
var sprite = new THREE.Sprite( material2 );

sprite.name="Sprite";

scene.add( sprite ); 
objects.push(sprite);

var light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 1, 1 ).normalize();
scene.add(light);
light.name="Luce";

var light2 = new THREE.DirectionalLight( 0xffffff );
light2.position.set( 3, 1, 1 ).normalize();
scene.add(light2);
light2.name="Luce 2";
var currentPlane= undefined;


//sprite.scale.set(160,93.50,1);
sprite.scale.set(157,87.50,1);
/*  var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );
     */
var controls = new THREE.OrbitControls( camera, renderer.domElement );

controls.screenSpacePanning=true;
controls.enableRotate=false;
var stopanimate=function(){
cancelAnimationFrame( idanimation );
}
var animate = function () {
    idanimation=requestAnimationFrame( animate );

    /* cube.rotation.x += 0.01;
    cube.rotation.y += 0.01; */

    renderer.render( scene, camera );
};
renderer.render( scene, camera );
animate();

async function activateCameraOption(el) {
    var cosa=$(el).attr('cameraoption');
    if (controls[cosa]){
        $(el).css('background-color','unset');
        controls[cosa]=false;
    }else{
        $(el).css('background-color','orange');
        controls[cosa]=true;
    }
}

async function resetCameraOption(){
    controls.reset();
    currentPlane=undefined;
}




var Pts2=undefined;
var raycaster = new THREE.Raycaster();
            var mm = new THREE.Vector2();
            var punti=[];

            var geoPunti=new THREE.BufferGeometry();
            var matp = new THREE.PointsMaterial( { color: 0xff0000,sizeAttenuation:false,size:10.0 } );
            var Pts=new THREE.Points(geoPunti,matp);
            scene.add(Pts);
           Pts.name='Punti';
            var modo=undefined;
           // var mesh = new THREE.Mesh( geometry, material );
            

/**
 * Inizio mous actions
 * 
 * @param {} event 
 */
                function KKeyUp( event ) {
                    console.log(event);
                    if (modo=='SELECT' || event.code=='Delete'){
                        var punti=undefined;
                       
                        if (selObj!=undefined){
                            if (selPoint!=undefined){
                                var geoPunti=selObj.geometry;
                                if (punti==undefined){
                                    var posz=geoPunti.getAttribute('position');
                                    var npunti=posz.array.length/3;
                                    punti=[];
                                   for (var i=0;i<npunti;i++){
                                        var p=new THREE.Vector3();
                                        var idx=i*3;
                                        p.x=posz.array[idx];
                                        p.y=posz.array[idx+1];
                                        p.z=posz.array[idx+2];
                                        punti.push(p);
                                   }
                                }
                                var geo=selObj.geometry;
                                var positions=geo.getAttribute('position');
                                punti.splice(selPoint,1);
                                geo.setFromPoints(punti);
                                
                                geo.attributes.position.needsUpdate = true;
                                geo.positionNeedsUpdate=true;
                               // console.log('NEW POSITION:'+selPoint+" "+JSON.stringify(position));
                            }
                        }
                    }
                }


                function MMouseUp( event ) {
                    if (modo=='ADDPOINT'){
                        if (selezioneCorrente.length<1){
                            return;
                        }
                        var obj=selezioneCorrente[0];
                        //var obj=objsel.OBJECT;

                        var punti=undefined;
                        var geoPunti=obj.geometry;
                        if (punti==undefined){
                            var posz=geoPunti.getAttribute('position');
                            var npunti=posz.array.length/3;
                            punti=[];
                           for (var i=0;i<npunti;i++){
                                var p=new THREE.Vector3();
                                var idx=i*3;
                                p.x=posz.array[idx];
                                p.y=posz.array[idx+1];
                                p.z=posz.array[idx+2];
                                punti.push(p);
                           }
                        }

                    // calculate mouse position in normalized device coordinates
                    // (-1 to +1) for both components
                    
                    mm.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                    mm.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

                    raycaster.setFromCamera( mm, camera );

                    // calculate objects intersecting the picking ray
                   // var intersects = raycaster.intersectObjects( scene.children );
                   
                    var intersects = raycaster.intersectObject( sprite );
                   if (currentPlane!=undefined){
                    var intersects2 = new THREE.Vector3();
                    raycaster.ray.intersectPlane(currentPlane, intersects2);
                     intersects = [{point:intersects2}];
                   }
                    

                    for ( var i = 0; i < intersects.length; i++ ) {

                      //  intersects[ i ].object.material.color.set( 0xff0000 );
                        var position = intersects[i].point;
                        punti.push(position);

                        geoPunti.setFromPoints(punti);
                        geoPunti.attributes.position.needsUpdate = true;
                        geoPunti.setDrawRange( 0, punti.length );
                        console.log(position);
                        /* position = intersects[i].object.position;

                        console.log(position); */
                        //console.log('POS '+i+":"+JSON.stringify(intersects[i]));

                    }
                }
                mm.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                mm.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
                }


                function MMouseMove( event ) {
                    if (event.buttons>0){
                 //   console.log('MOVING ON modo='+modo+" "+event.buttons+" "+event.which);
                 /*    for (var x in event){
                        console.log('X:'+x+" "+event[x] );
                    } */
                    if (event.buttons==1||event.which==1){
                    if (modo=='MOVEZ'){
                        console.log('DRAGGING ON modo='+modo+" "+event.buttons);
                        if (selezioneCorrente.length>0){
                            var mx = ( event.clientX / window.innerWidth ) * 2 - 1;
                            mm.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
                           
                            var sObj=selezioneCorrente[0];
                            console.log('NPOS:'+JSON.stringify(sObj.position));
                           
                            sObj.position.z-=10*(mx-mm.x);
                            console.log('NPOS:'+JSON.stringify(sObj.position));
                            sObj.positionNeedsUpdate=true;
                           // selObj.translateZ( 10*(mx-mm.x) );
                            mm.x=mx;
                        }else{

                        }
                    }
                    if (modo=='MOVEY'){
                        console.log('DRAGGING ON modo='+modo+" "+event.buttons);
                        if (selezioneCorrente.length>0){
                            var mx = ( event.clientX / window.innerWidth ) * 2 - 1;
                            var my = - ( event.clientY / window.innerHeight ) * 2 + 1;
                           
                            var sObj=selezioneCorrente[0];
                            console.log('NPOS:'+JSON.stringify(sObj.position));
                           
                            sObj.position.y+=10*(my-mm.y);
                            console.log('NPOS:'+JSON.stringify(sObj.position));
                            sObj.positionNeedsUpdate=true;
                           // selObj.translateZ( 10*(mx-mm.x) );
                            mm.x=mx;
                            mm.y=my;
                        }else{

                        }
                    }
                    if (modo=='MOVEX'){
                        console.log('DRAGGING ON modo='+modo+" "+event.buttons);
                        if (selezioneCorrente.length>0){
                            var mx = ( event.clientX / window.innerWidth ) * 2 - 1;
                            var my = - ( event.clientY / window.innerHeight ) * 2 + 1;
                           
                            var sObj=selezioneCorrente[0];
                            console.log('NPOS:'+JSON.stringify(sObj.position));
                           
                            sObj.position.x+=10*(mx-mm.x);
                            console.log('NPOS:'+JSON.stringify(sObj.position));
                            sObj.positionNeedsUpdate=true;
                           // selObj.translateZ( 10*(mx-mm.x) );
                            mm.x=mx;
                            mm.y=my;
                        }else{

                        }
                    }
                 //       console.log('DRAGGING ON modo='+modo+" "+event.buttons);
                    if (modo=='DRAG'){
                  //      console.log('DRAGGING ON modo="DRAG"');
                    // calculate mouse position in normalized device coordinates
                    // (-1 to +1) for both components

                    mm.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                    mm.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

                    raycaster.setFromCamera( mm, camera );

                    // calculate objects intersecting the picking ray
                   // var intersects = raycaster.intersectObjects( scene.children );
                    var intersects = raycaster.intersectObject( zPlane );
                    if (intersects.length>0){
                    var position = intersects[0].point;
                    if (selObj!=undefined){
                        if (selPoint!=undefined){
                            var geo=selObj.geometry;
                            var positions=geo.getAttribute('position');
                            var arr=positions.array;
                            arr[selPoint*3]=position.x;
                            arr[selPoint*3+1]=position.y;
                            geo.attributes.position.needsUpdate = true;
                            geo.positionNeedsUpdate=true;
                            console.log('NEW POSITION:'+selPoint+" "+JSON.stringify(position));
                        }
                    }
                }

                   
                }
            }
        }
                }

                var selObj=undefined;
                var selPoint=undefined;
                var selPoints=[];

                function MMouseClick( event ) {
                    if (event.ctrlKey||modo=='ADDPOINT'){
                    }
                    // calculate mouse position in normalized device coordinates
                    // (-1 to +1) for both components
                    if (modo=='SELECT'){
                      
                    mm.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                    mm.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
                    console.log('Siamo qui:'+mm.x+":"+mm.y+" sel:"+selezioneCorrente.length+" ");
                    raycaster.setFromCamera( mm, camera );

                    // calculate objects intersecting the picking ray
                   // var intersects = raycaster.intersectObjects( scene.children );
                   // var intersects = raycaster.intersectObject( sprite );
                   raycaster.params.Points.threshold = 0.2;
                   for (var i=0;i<selezioneCorrente.length;i++){
                       var o2=selezioneCorrente[i];
                       o2.geometry.computeBoundingSphere();
                   }
                    var intersects = raycaster.intersectObjects( selezioneCorrente );
                        console.log('Ci sono '+intersects.length+" intersezioni");
                        if (intersects.length>0){
                        var int=intersects[0];
                        var idx=int.index;
                        var multiselect=false;
                                if (idx!=undefined){
                                    if (event.ctrlKey){
                                        multiselect=true;
                                    }
                                    var geo=int.object.geometry;
                                    var colors=[];
                                    
                                    for (var i=0;i<geo.getAttribute('position').length;i++){
                                        var col=new THREE.Color();
                                        col.setRGB(0.99,0.1,0.8);
                                        colors.push(col.r,col.g,col.b);
                                        }
                                    
                                   // geo.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
                                //    
                                    geo.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
                                    var attr=geo.attributes;
                                   
                                    var matp2 = new THREE.PointsMaterial( { vertexColors:THREE.VertexColors,sizeAttenuation:false,size:10.0 } );
                                    int.object.material=matp2;
                                    selObj=int.object;
                                    selPoint=idx;
                                    if (!multiselect){
                                        selPoints=[];
                                        selLists=[];
                                    }
                                    var p=new THREE.Vector3();
                                   
                                    console.log('QUESTO OGGETTO E\' '+idx+":"+JSON.stringify(geo.attributes.position.array[idx*3]));
                                    p.x=geo.attributes.position.array[idx*3];
                                    p.y=geo.attributes.position.array[idx*3+1];
                                    p.z=geo.attributes.position.array[idx*3+2];
                                    selPoints.push(p);
                                   
                                    var cols=geo.getAttribute('color');
                                    var col=new THREE.Color();
                                    col.setRGB(0.998,0.0,0.0);
                                    //cols.array[idx*3]=col.r;
                                    cols.array[idx*3]=col.r;
                                    cols.array[idx*3+1]=col.g;
                                    cols.array[idx*3+2]=col.b;
                                    geo.colorNeedsUpdate=true;
                                    console.log("attr:"+JSON.stringify(cols));
                                   // colors.splice(idx*3,3,[col.r,col.g,col.b]);
                                  //  cols[idx]=col;
                                   
                                   /*  attr.size[idx]=20;
                                    attr.size.needsUpdate=true; */
                                  
                                }
                            }
                           /*  for ( var i = 0; i < intersects.length; i++ ) {
                                console.log('DIMMI:'+ intersects[ i ].object.HID+" "+JSON.stringify(intersects[ i ]))
                               intersects[ i ].object.material.color.set( 0xf0f0f0 );
                                var int=intersects[i];
                                var idx=int.index;
                                if (idx!=undefined){
                                  
                                }
                            } */

                  /*   for ( var i = 0; i < intersects.length; i++ ) {

                      //  intersects[ i ].object.material.color.set( 0xff0000 );
                        var position = intersects[i].point;
                        punti.push(position);

                        geoPunti.setFromPoints(punti);
                        geoPunti.attributes.position.needsUpdate = true;
                        geoPunti.setDrawRange( 0, punti.length );
                        console.log(position);
                        position = intersects[i].object.position;

                        console.log(position);
                        //console.log('POS '+i+":"+JSON.stringify(intersects[i]));

                    } */
                }

                }


                async function activateBottone(el){
                    modo=$(el).attr('mbottone');
                    $('.sbottone').css('background-color','unset');
                    await sleeping(20);
                    $(el).css('background-color','orange');
                }
/*
                Fine mouse movements
*/




                var ncurve=0;
                var shapes=[];

                function CreaShape(el){
                    var obj=getObjEl(el);
                    if (obj!=undefined){
                        var ARC_SEGMENTS = 200;
                        /*   var clone=punti[0].clone();
                          punti.push(clone); */
                          var geo = new THREE.BufferGeometry();
                        geo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( ARC_SEGMENTS * 3 ), 3 ) );
                        var pxs=[];
                        if (obj.OBJECT.geometry.attributes && obj.OBJECT.geometry.attributes.position){
                        console.log('Ci sono:'+JSON.stringify(obj.OBJECT.geometry.attributes.position.array.length)); 
                        

                        
                        for (var k=0;k<obj.OBJECT.geometry.attributes.position.array.length;k=k+3){
                            
                            var p=new THREE.Vector2();
                            p.x=obj.OBJECT.geometry.attributes.position.array[k];
                            p.y=obj.OBJECT.geometry.attributes.position.array[k+1];
                           // p.z=obj.OBJECT.geometry.attributes.position.array[k+2];
                            pxs.push(p);
                        }
                    }else{
                        if (obj.OBJECT.geometry.vertices){
                            console.log('Ci sono:'+JSON.stringify(obj.OBJECT.geometry.vertices.length));
                            for (var k=0;k<obj.OBJECT.geometry.vertices.length;k++){
                                var p=new THREE.Vector2();
                                p.x=obj.OBJECT.geometry.vertices[k].x;
                                p.y=obj.OBJECT.geometry.vertices[k].y;
                                pxs.push(p);
                            }
                        }
                    }
                        var curve = new THREE.CatmullRomCurve3( pxs );
                       
                        curve.curveType = 'centripetal';
                        curve.closed = true;
                        const points = curve.getPoints( 200 );

                        const shape = new THREE.Shape( points );
                        const geometry = new THREE.ShapeGeometry( shape );
                        const material = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide ,color:0xfafe23} );
                        
                        const mesh = new THREE.Mesh( geometry, material );
                        mesh.name="Shape originata da "+obj.DESCRIZIONE;
                        scene.add( mesh );
                        mesh.userData.SHAPE=shape;
                       // shapes.push(shape);
                        aggiornaPannello();
                    }else{
                        console.log('NOTFOUND');
                    }
                }

                function creacurva(){
                    var ARC_SEGMENTS = 200;
                  /*   var clone=punti[0].clone();
                    punti.push(clone); */
                    var geo = new THREE.BufferGeometry();
				geo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( ARC_SEGMENTS * 3 ), 3 ) );
                    var curve = new THREE.CatmullRomCurve3( punti );
                 
                curve.curveType = 'centripetal';
			/* 	curve.mesh = new THREE.Line( geo.clone(), new THREE.LineBasicMaterial( {
					color: 0x00ff00,
					opacity: 0.35,
					linewidth: 2
					} ) );
				curve.mesh.castShadow = true; */
                curve.closed = true;
             
               // scene.add( curve );
              /*  var obj=new Risorsa('OBJ3D');
               obj.OBJECT=curve;
               obj.DESCRIZIONE='SPLINE'; */
               var tg=$('body').find('[tipo="azioni"]');
              //  $(tg).append('<div><span hid="'+obj.HID+'" onclick="ToggleNascondi(this);">Oggetto Nuovo:'+obj.DESCRIZIONE+'</span><span><i class="fa fa-save" hid="'+obj.HID+'" onclick="SalvaQuesto(this);"></i></span></div>');

                const points = curve.getPoints( 200 );

                const shape = new THREE.Shape( points );

                const geometry = new THREE.ShapeGeometry( shape );
                const material = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide ,color:0xfafe23} );
                
                const mesh = new THREE.Mesh( geometry, material );
                scene.add( mesh );
                
                
                var obj=new Risorsa('OBJ3D');
                    obj.OBJECT=mesh;
                    obj.DESCRIZIONE='SHAPE MESH '+ncurve;
                    mesh.name=obj.DESCRIZIONE;
                    
                    ncurve++;
                    punti=[];
                //$(tg).append('<div><span hid="'+obj.HID+'" onclick="ToggleNascondi(this);">Oggetto Nuovo:'+obj.DESCRIZIONE+'</span><span><i class="fa fa-save" hid="'+obj.HID+'" onclick="Subtract(shapes);"></i></span></div>');
                geoPunti=new THREE.BufferGeometry();
                var matp2 = new THREE.PointsMaterial( { color: 0x0000ff,sizeAttenuation:false,size:10.0 } );
                Pts2=new THREE.Points(geoPunti,matp2);
                scene.add(Pts2);
               Pts2.name='Punti';

              /*  var extrudeSettings = {
                steps: 2,
                depth: 16,
                bevelEnabled: true,
                bevelThickness: 1,
                bevelSize: 1,
                bevelOffset: 0,
                bevelSegments: 3
            };
            var geo2 = new THREE.ExtrudeGeometry( shape, extrudeSettings ); */
            shapes.push(shape);
            aggiornaPannello();
              /*   
                var extrudeSettings = {
                    steps: 2,
                    depth: 16,
                    bevelEnabled: true,
                    bevelThickness: 1,
                    bevelSize: 1,
                    bevelOffset: 0,
                    bevelSegments: 1
                };
                var geo2 = new THREE.ExtrudeGeometry( shape, extrudeSettings );
               // var mat2 = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
                var mat2 = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide ,color:0xfa23fe} );
                var mesh2 = new THREE.Mesh( geo2, mat2 ) ;
                    scene.add( mesh2 );
                    mesh2.name='QUESTO E\' IL PRIMO OGGETTO';
                    var obj=new Risorsa('OBJ3D');
                    obj.OBJECT=mesh2;
                    obj.DESCRIZIONE='QUESTO E\' IL PRIMO OGGETTO';
                   // Risorsa.registerElement(obj);
                    $(tg).append('<div><span hid="'+obj.HID+'" onclick="ToggleNascondi(this);">Oggetto Nuovo:'+obj.DESCRIZIONE+'&nbsp;</span><span><i class="fa fa-save" hid="'+obj.HID+'" onclick="SalvaQuesto(this);"></i></span></div>'); */
                
/* 
                     var points = curve.getSpacedPoints( 100 );
                    var geometry = new THREE.BufferGeometry().setFromPoints( points );

                    var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

                    // Create the final object to add to the scene
                    var curveObject = new THREE.Line( geometry, material ); 
                    scene.add(curveObject); */
                  //  scene.add(curve.mesh);
                //    sprite.visible = false;
                }

var fAddPoint=async function(el){
    var ob=getObjEl(el);
    var obj=ob.OBJECT;
    //var obj=objsel.OBJECT;

    var punti=undefined;
    var geoPunti=obj.geometry;
    if (punti==undefined){
        var posz=geoPunti.getAttribute('position');
        var npunti=posz.array.length/3;
        punti=[];
       for (var i=0;i<npunti;i++){
            var p=new THREE.Vector3();
            var idx=i*3;
            p.x=posz.array[idx];
            p.y=posz.array[idx+1];
            p.z=posz.array[idx+2];
            punti.push(p);
       }
    }

// calculate mouse position in normalized device coordinates
// (-1 to +1) for both components

mm.x = ( event.clientX / window.innerWidth ) * 2 - 1;
mm.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

raycaster.setFromCamera( mm, camera );

// calculate objects intersecting the picking ray
// var intersects = raycaster.intersectObjects( scene.children );
var intersects = raycaster.intersectObject( sprite );


for ( var i = 0; i < intersects.length; i++ ) {

  //  intersects[ i ].object.material.color.set( 0xff0000 );
    var position = intersects[i].point;
    punti.push(position);

    geoPunti.setFromPoints(punti);
    geoPunti.attributes.position.needsUpdate = true;
    geoPunti.setDrawRange( 0, punti.length );
    console.log(position);
    position = intersects[i].object.position;

    console.log(position);
    //console.log('POS '+i+":"+JSON.stringify(intersects[i]));

}
}

var fSubtract=async function(){
    if (selezioneCorrente.length<2){
        return;
    }
    var obj1=selezioneCorrente[0];
    var obj2=selezioneCorrente[1];
    if (obj1.userData.SHAPE==undefined||obj2.userData.SHAPE==undefined){
        hopnotify('Differenza tra shape','Uno dei due oggetti non e\' una shape')
        return;
    }
    var s1=obj1.userData.SHAPE.clone();
    var s2=obj2.userData.SHAPE.clone();
    s1.holes.push( s2 );
    const geometry = new THREE.ShapeGeometry( s1 );
    const material = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide ,color:0x09fe23} );
    
    const mesh = new THREE.Mesh( geometry, material );
    mesh.name="Shape con buchi originata da "+obj1.DESCRIZIONE;
    scene.add( mesh );
    mesh.userData.SHAPE=s1;
   // shapes.push(shape);
    aggiornaPannello();

}

var fDifference=async function(){
    if (selezioneCorrente.length<2){
        return;
    }
    var v1=selezioneCorrente[0];
    var v2=selezioneCorrente[1];
        var master = new ThreeBSP( v1 );
        
        var other=new ThreeBSP(v2);
		var subtract_bsp = master.subtract( other );
		/* var result = subtract_bsp.toMesh( new THREE.MeshLambertMaterial({
			shading: THREE.SmoothShading,
			map: new THREE.TextureLoader().load('temp/texture.png')
        })); */
        var mat2 = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide ,color:0xfa23fe} );
        var result = subtract_bsp.toMesh( mat2);
        var bgeo = new THREE.BufferGeometry().fromGeometry( result.geometry );
        
        //var bgeo = new THREE.BufferGeometry().fromDirectGeometry(result.geometry);
       // console.log(bgeo);

      /*  var pp=bgeo.attributes.position.array;
         var points=[];
        for (var j=0;j<pp.length/3;j++){
            var v=new THREE.Vector3();
            v.x=pp[i*3];
            v.y=pp[i*3+1];
            v.z=pp[i*3+2];
            points.push(v);
        } */

     /*  var ngeo=new THREE.ConvexGeometry( points );
        result=new THREE.Mesh(ngeo,mat2); */
        result=new THREE.Mesh(bgeo,mat2);
       // result.geometry.computeVertexNormals();
        result.name='SOTTRAZIONE';
        
        scene.add(result);
        aggiornaPannello();
}

var xCamera=function(){
    camera.position.set( 70, 0, 0 );
    camera.lookAt( 0, 0, 0 );
    var plane = new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), 0 );
    currentPlane=plane;
}

var yCamera=function(){
    camera.position.set( 0, 70, 0 );
    camera.lookAt( 0, 0, 0 );
    var plane = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 0 );
    currentPlane=plane;
}

var zCamera=function(){
    camera.position.set( 0, 0, 70 );
    camera.lookAt( 0, 0, 0 );
    var plane = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 0 );
    currentPlane=plane;
}


var fEliminaQuesto=async function(el){
    var obj=getObjEl(el);
    if (obj!=undefined){
        var yesno=await hopconfirm('Eliminazione Oggetto','Vuoi eliminare questo oggetto '+obj.DESCRIZIONE);
        if (yesno){
            for (var i=0;i<scene.children.length;i++){
                var o2=scene.children[i];
                if (o2.uuid==obj.OBJECT.uuid){
                    scene.remove(o2);
                    aggiornaPannello();
                }
            }
        }
    }
}

var fCreaGruppo=async function(el){
    if (selezioneCorrente.length>0){
        var group = new THREE.Group();
        for (var i=0;i<selezioneCorrente.length;i++){
            group.add( selezioneCorrente[i] );
        }
        
        group.name="Nuovo Gruppo";
        scene.add( group );
       
       aggiornaPannello();
    }
}

var fCreaPrisma=async function(){
    var A = new THREE.Vector2( 0, 0 );
var B = new THREE.Vector2( 30, 10 );
var C = new THREE.Vector2( 20, 50 );

var height = 3;                   
var geometry = new PrismGeometry( [ A, B, C ], height ); 

var material = new THREE.MeshPhongMaterial( { color: 0x00b2fc, specular: 0x00ffff, shininess: 20 } );

var prism1 = new THREE.Mesh( geometry, material );
prism1.rotation.x = -Math.PI  /  2;

prism1.name="Prisma";
scene.add( prism1 );

aggiornaPannello();
}

var fAddCube=function (el){
    var geometry = new THREE.BoxGeometry( 10, 10, 10 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ffff} );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    cube.name="CUBO";
    aggiornaPannello();
}


var fCopy=async function(el){
    var obj=getObjEl(el);
    if (obj!=undefined){
        var o2=obj.OBJECT.clone();
        scene.add(o2);
        o2.name="Copiato da "+obj.DESCRIZIONE;
        aggiornaPannello();
    }
}

var fResize=async function(el){
    var obj=getObjEl(el);
    if (obj!=undefined){
        var sc=new THREE.Vector3();
        sc.x=0.1;
        sc.y=0.1;
        sc.z=0.1;
        obj.OBJECT.scale.x=sc.x;
        obj.OBJECT.scale.y=sc.y;
        obj.OBJECT.scale.z=sc.z;
        obj.OBJECT.updateMatrix();
    }
}

var fResize2=async function(el){
    var obj=getObjEl(el);
    if (obj!=undefined){
        var fact=0.10714;
        //var fact=0.11714;
        var geo=obj.OBJECT.geometry;
        var positions=geo.getAttribute('position');
        console.log('POS ARRAY:'+positions.array.length);
        for (var i=0;i<positions.array.length;i++){
            var v=positions.array[i];
            v=fact*v;
            console.log('Assegno:'+v+" a "+positions.array[i]);
            positions.array[i]=v;
            
        }
        geo.attributes.position.needsUpdate = true;
       // geo.positionNeedsUpdate=true;
    }else{
        console.log('Anomalia impensabile');
    }
}

var fAddCircle=async function(el){

    var conf=new Risorsa('TCONF');
    conf.RADIUS=10;
    var panel=$.parseHTML(getServerModule('Takeup','CIRCLE_CFG'));
        applyFormRecord(panel,conf);
        
       
    var yesno=await hopconfirm('Creazione Cerchio',panel);
    if (yesno){

        var segmentCount = 32,
            radius = conf.RADIUS,
            geometry = new THREE.Geometry(),
            material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });

        for (var i = 0; i <= segmentCount; i++) {
            var theta = (i / segmentCount) * Math.PI * 2;
            geometry.vertices.push(
                new THREE.Vector3(
                    Math.cos(theta) * radius,
                    Math.sin(theta) * radius,
                    0));            
        }
        var obj=new THREE.Line(geometry, material);
        obj.name='Cerchio';
        scene.add(obj);
        /* var geometry = new THREE.CircleGeometry( conf.RADIUS, 32 );
        var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        var circle = new THREE.Mesh( geometry, material );
        scene.add( circle ); */
        aggiornaPannello();
    }
}

var fAddSquare=async function(el){

    var conf=new Risorsa('TCONF');
    conf.X=10;
    conf.Y=10;
    var panel=$.parseHTML(getServerModule('Takeup','SQUARE_CFG'));
        applyFormRecord(panel,conf);
        
       
    var yesno=await hopconfirm('Creazione Quadrado',panel);
    if (yesno){

        var segmentCount = 32,
            radius = conf.RADIUS,
            geometry = new THREE.Geometry(),
            material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        var vstart=new THREE.Vector3(-1.0*conf.X,-1.0*conf.Y,0);
            geometry.vertices.push(vstart);
            geometry.vertices.push(new THREE.Vector3(1.0*conf.X,-1.0*conf.Y,0));
            geometry.vertices.push(new THREE.Vector3(1.0*conf.X,1.0*conf.Y,0));
            geometry.vertices.push(new THREE.Vector3(-1.0*conf.X,1.0*conf.Y,0)); 
           // geometry.vertices.push(vstart);

       /*  for (var i = 0; i <= segmentCount; i++) {
            var theta = (i / segmentCount) * Math.PI * 2;
            geometry.vertices.push(
                new THREE.Vector3(
                    Math.cos(theta) * radius,
                    Math.sin(theta) * radius,
                    0));            
        } */
        var obj=new THREE.Line(geometry, material);
        obj.name='Quadrato';
        scene.add(obj);
        /* var geometry = new THREE.CircleGeometry( conf.RADIUS, 32 );
        var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        var circle = new THREE.Mesh( geometry, material );
        scene.add( circle ); */
        aggiornaPannello();
    }
}

var fSpecular=async function (el){
    var obj=getObjEl(el);
    if (obj!=undefined){
        var res2=obj.OBJECT.clone();
       res2.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
       res2.name='Riflessione di '+obj.DESCRIZIONE;
       scene.add(res2);
       aggiornaPannello();
    }
}

var fZSpec=async function (el){
    var obj=getObjEl(el);
    if (obj!=undefined){
        var res2=obj.OBJECT.clone();
       res2.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
       res2.name='Riflessione di '+obj.DESCRIZIONE;
       scene.add(res2);
       aggiornaPannello();
    }
}

var fExtrude=async function(el){
    var obj=getObjEl(el);
    if (obj!=undefined){
        var extCfg=new Risorsa('EXTRCFG');
        extCfg.STEPS=2;
        extCfg.DEPTH=3;
       extCfg.BEVELENABLED=true;
        extCfg.BEVELTHICKNESS=1;
        extCfg.BEVELSIZE=1;
        extCfg.BEVELOFFSET=0;
        extCfg.BEVELSEGMENTS=3;
        if (obj.OBJECT==undefined || obj.OBJECT.userData.SHAPE==undefined){
            await hopnotify('Estrusione Oggetto','Impossibile estrudere un oggetto senza Shape');
            return;
        }
        var panel=$.parseHTML(getServerModule('Takeup','BEVEL_CFG'));
        applyFormRecord(panel,extCfg);
        var yesno=await hopconfirm('Estrusione oggetto',panel);
        if (yesno){

            
            var v1 =new THREE.Vector3( 0, 0, 0 ) ;
            var v2=new THREE.Vector3( 0, 0, extCfg.DEPTH ) ;
           var line=new THREE.LineCurve3( v1, v2  )
           

 

            var extrudeSettings = {
                steps:parseInt(extCfg.STEPS),
                depth:extCfg.DEPTH,
                bevelEnabled: extCfg.BEVELENABLED,
                bevelThickness: extCfg.BEVELTHICKNESS,
                bevelSize: extCfg.BEVELSIZE,
                bevelOffset: extCfg.BEVELOFFSET,
                bevelSegments: extCfg.BEVELSEGMENTS/* ,
                extrudePath:line */
            };
            console.log('object:'+obj.OBJECT.userData.SHAPE);

            var v1 = new THREE.ExtrudeGeometry( obj.OBJECT.userData.SHAPE, extrudeSettings );
   
            var mat2 = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide ,color:0xfa23fe} );
            /*  var bgeo = new THREE.BufferGeometry().fromGeometry( geometryThree ); */
                var result=new THREE.Mesh(v1,mat2);
           result.name="Estrusione di "+obj.DESCRIZIONE;
         //  scene.add(result);
          /*  var res2=result.clone();
           res2.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1)); */
         //  scene.add(res2);
       /*   var geo=result.geometry;
         console.log(geo);
        var positions=geo.vertices;
        var fact=extCfg.DEPTH/18;
        console.log('POS ARRAY:'+positions.length);
        for (var i=0;i<positions.length;i++){
            var v=positions[i];
            v.z=fact*v.z;
            //console.log('Assegno:'+v+" a "+positions.array[i]);
           // positions.array[i*3+2]=v;
            
        }
        geo.verticesNeedsUpdate = true; */
         scene.add(result);
         aggiornaPannello();
        }
    }
}


var Subtract=function (){
    
    var extrudeSettings = {
        steps: 2,
        depth: 16,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 3
    };
    var s1=shapes[0];
    var s2=shapes[1];
    s1.holes.push( s2 );
    
   // var v1 = new THREE.ExtrudeGeometry( shapes[0], extrudeSettings );

    var v1 = new THREE.ExtrudeGeometry( shapes[0], extrudeSettings );
   
		if (shapes[1]==undefined){
            console.log('ERRORE NESSUNA SHAPE SOTTRAIBILE');
            return;
        }

        /* extrudeSettings = {
            steps: 2,
            depth: 20,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 3
        };

        var v2 = new THREE.ExtrudeGeometry( shapes[1], extrudeSettings );
        var master1    = THREE.CSG.toCSG(v1);
        v2.translate (0.0,0.0, -2.1 );
        var other1    = THREE.CSG.toCSG(v2);
       var res= master1.subtract(other1);


        var geometryThree  = THREE.CSG.fromCSG(res); */
        var mat2 = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide ,color:0xfa23fe} );
        /*  var bgeo = new THREE.BufferGeometry().fromGeometry( geometryThree ); */
       var result=new THREE.Mesh(v1,mat2);
       result.name="SOTTRATTO";
     //  scene.add(result);
       var res2=result.clone();
       res2.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
     //  scene.add(res2);
     var group = new THREE.Group();
     group.add( result );
     group.add( res2 );
     group.name="Fusto";
     scene.add( group );
       res2.name='SPECULAR';
       shapes[0].visible=false;
       shapes[1].visible=false;
       aggiornaPannello();
       return;


        var master = new ThreeBSP( v1 );
        var v2 = new THREE.ExtrudeGeometry( shapes[1], extrudeSettings );

        var other=new ThreeBSP(v2);
		var subtract_bsp = master.subtract( other );
		/* var result = subtract_bsp.toMesh( new THREE.MeshLambertMaterial({
			shading: THREE.SmoothShading,
			map: new THREE.TextureLoader().load('temp/texture.png')
        })); */
        var mat2 = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide ,color:0xfa23fe} );
        var result = subtract_bsp.toMesh( mat2);
        var bgeo = new THREE.BufferGeometry().fromGeometry( result.geometry );
        result=new THREE.Mesh(bgeo,mat2);
       // result.geometry.computeVertexNormals();
        result.name='SOTTRAZIONE';
        scene.add(result);
        shapes[0].visible=false;
        shapes[1].visible=false;
        aggiornaPannello();
       /*  var tg=$('body').find('[tipo="azioni"]');
        var obj=new Risorsa('OBJ3D');
        obj.OBJECT=result;
        obj.DESCRIZIONE=result.name; */
       // Risorsa.registerElement(obj);
       // $(tg).append('<div><span hid="'+obj.HID+'" onclick="ToggleNascondi(this);">Oggetto Nuovo:'+obj.DESCRIZIONE+'&nbsp;</span><span><i class="fa fa-save" hid="'+obj.HID+'" onclick="SalvaQuesto(this);"></i></span></div>'); 
   

}                

window.addEventListener( 'mouseup', MMouseUp, false );

window.addEventListener( 'mousedown', MMouseClick, false );

window.addEventListener( 'mousemove', MMouseMove, false );

window.addEventListener( 'keyup', KKeyUp, false );


var ToggleNascondi=function(el){
    var obj=getObjEl(el);
    if (obj!=undefined){
        if (obj.OBJECT.visible){
            obj.OBJECT.visible=false;
        }else{
            obj.OBJECT.visible=true;
        }
    }else{
        console.log('Attenzione nessun oggetto');
    }
}

var SalvaQuesto=async function(el){
    var obj2=getObjEl(el);
    if (obj2!=undefined){
        var obj=cloneObj(obj2);
        
            obj.OBJECT=obj2.OBJECT.toJSON();
            var ret=await Risorsa.asave(obj);
           // obj.OBJECT=obj.OBJECT.toJSON();
            if (ret!=undefined && ret.Esito=='OK'){
                await hopnotify('Salvataggio','Oggetto salvato correttamente:'+obj.HID+" "+$(el).attr('hid')+" "+obj.DESCRIZIONE);
            }
        
    }else{
        console.log('Attenzione nessun oggetto');
    }
}

var ScaricaStl=async function(el){
    var obj=getObjEl(el);
    if (obj!=undefined){
        var mesh=obj.OBJECT;
        var exporter = new THREE.STLExporter();
        var result = exporter.parse( mesh, { binary: true } );
				savexArrayBuffer( result, obj.DESCRIZIONE+'.stl' );

    }

}

var ScaricaObj=async function(el){
    var obj=getObjEl(el);
    if (obj!=undefined){
        var mesh=obj.OBJECT;
        var exporter = new THREE.OBJExporter();
       // var result = exporter.parse( scene );
        var result = exporter.parse( mesh);
        savexArrayBuffer( result, obj.DESCRIZIONE+'.obj' );

    }

}




var linkSave =undefined;
function savex( blob, filename ) {
    if (linkSave==undefined){
        linkSave = document.createElement( 'a' );
        linkSave.style.display = 'none';
        document.body.appendChild( linkSave );
    }
	
    linkSave.href = URL.createObjectURL( blob );
    linkSave.download = filename;
    linkSave.click();
}
function savexString( text, filename ) {
    savex( new Blob( [ text ], { type: 'text/plain' } ), filename );
}
function savexArrayBuffer( buffer, filename ) {
    savex( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
}

var bonload=async function(){
    var v=getServerModule('Takeup','ALTRO');
    $('body').append(v);

    var loader=new THREE.ObjectLoader();
    /*  var r=await Risorsa.aload('OBJ3D_1578793477804_8');
    if (r!=undefined){
        console.log('Caricato Oggetto:'+r.OBJECT);
        var ogg=undefined;
        var ogg=await loader.parse(r.OBJECT);
      
        
        if (ogg!=undefined){
            scene.add(ogg);
            console.log('Caricato OGGETTO!!! '+ JSON.stringify(ogg));
        }else{
            console.log('Errore nel parsing:'+ogg+' '+JSON.stringify(ogg));
        }
    } 
      */
     var r=await Risorsa.aload('OBJ3D_1578865822320_5');
     if (r!=undefined){
         console.log('Caricato Oggetto:'+r.OBJECT);
         var ogg=undefined;
         var ogg=await loader.parse(r.OBJECT);
        
         
         if (ogg!=undefined){
           // ogg.HID=r.HID;
           r.OBJECT=ogg;
           loggetti[ogg.uuid]=r;
           
             scene.add(ogg);
             console.log('Caricato OGGETTO!!! '+ JSON.stringify(ogg));
         }else{
             console.log('Errore nel parsing:'+ogg+' '+JSON.stringify(ogg));
         }
     } 

     r=await Risorsa.aload('OBJ3D_1578866032472_8');
     if (r!=undefined){
         console.log('Caricato Oggetto:'+r.OBJECT);
         var ogg=undefined;
         var ogg=await loader.parse(r.OBJECT);
       
         
         if (ogg!=undefined){
           // ogg.HID=r.HID;
           r.OBJECT=ogg;
            loggetti[ogg.uuid]=r;
             scene.add(ogg);
             console.log('Caricato OGGETTO!!! '+ JSON.stringify(ogg));
         }else{
             console.log('Errore nel parsing:'+ogg+' '+JSON.stringify(ogg));
         }
     } 
     aggiornaPannello();
   /*  var tg=$('body').find('[tipo="azioni"]');
    for (var i=0;i< scene.children.length;i++){
        var obj=new Risorsa('OBJ3D');
        obj.DESCRIZIONE=scene.children[i].name;
        obj.OBJECT=scene.children[i];
        
        console.log('OBJ:'+JSON.stringify(obj));
        $(tg).append('<div><span hid="'+obj.HID+'" onclick="ToggleNascondi(this);">Oggetto '+i+':'+obj.DESCRIZIONE+'</span><span><i class="fa fa-save" hid="'+obj.HID+'" onclick="SalvaQuesto(this);"></i></span></div>');
    } */
};


var selezioneCorrente=[];
var callbackObjChange=async function(hid,campo,valore,el){
    var ogg=Risorsa.get(hid);
    console.log('Invocato callback update on '+hid);
    if (ogg!=undefined){

        if (campo=='DESCRIZIONE'){
            var ob=ogg.OBJECT;
            if (ob!=undefined && valore!=undefined && valore.length>0){
                ob.name=ogg.DESCRIZIONE;
            }
        }
            if (campo=='SELEZIONATO'){
                if (ogg.SELEZIONATO){
               
                var fnd=false;
                for (var i=0;i<selezioneCorrente.length;i++){
                    var o2=selezioneCorrente[i];
                    if (o2.HID==hid){
                        fnd=true;
                    }
                    
                }
                if (!fnd){
                    if (ogg.OBJECT!=undefined){
                    selezioneCorrente.push(ogg.OBJECT);
                    }else{
                        console.log('ATTENZIONE:Risorsa senza oggetto :'+hid);
                    }
                }
                console.log('SELEZIONATO:'+hid+" sel:"+selezioneCorrente.length);
                }else{
                //console.log('DESELEZIONATO:'+hid);
                for (var i=0;i<selezioneCorrente.length;i++){
                    var o2=selezioneCorrente[i];
                    var uuid=o2.uuid;
                    var obj=loggetti[uuid];
                    if (obj==undefined){
                        obj=new Risorsa('OBJ3D');
                        loggetti[uuid]=obj;
                        if (obj.DESCRIZIONE==undefined){
                            obj.DESCRIZIONE=o2.name;
                            }
                            if (obj.OBJECT==undefined){
                            obj.OBJECT=o2;
                            }
                        }
                    if (obj.HID==hid){
                        selezioneCorrente.splice(i,1);
                        break;
                        }
                    }
                    console.log('DESELEZIONATO:'+hid+" sel:"+selezioneCorrente.length);
                }
            }
        }
}

var listaOggetti=[];
var loggetti=[];

var aggiornaPannello=function(){
    var tg=$('body').find('[tipo="azioni"]');
    $(tg).empty();
    for (var i=0;i< scene.children.length;i++){
        var elm=scene.children[i];
        var uuid=elm.uuid;
        var obj=loggetti[uuid];
        if (obj==undefined){
            obj=new Risorsa('OBJ3D');
            loggetti[uuid]=obj;
            }
        if (obj.DESCRIZIONE==undefined){
        obj.DESCRIZIONE=elm.name;
        }
        if (obj.OBJECT==undefined){
        obj.OBJECT=elm;
        }
        
        obj.callbackUpdate=callbackObjChange;
        var form=$.parseHTML(getServerModule('Takeup','OBJECT_ACTIONS'));
       /*  console.log('OBJ:'+JSON.stringify(obj));
        $(tg).append('<div><span hid="'+obj.HID+'" onclick="ToggleNascondi(this);">Oggetto '+i+':'+obj.DESCRIZIONE+'</span><span><i class="fa fa-save" hid="'+obj.HID+'" onclick="SalvaQuesto(this);"></i></span></div>'); */
        applyFormRecord(form,obj);
        $(tg).append(form);
    }
}

var searchF=async function(){
    var obj=new Risorsa('SEARCH');
    var ric=$.parseHTML('<div></div>');
       /*  console.log('OBJ:'+JSON.stringify(obj));
        $(tg).append('<div><span hid="'+obj.HID+'" onclick="ToggleNascondi(this);">Oggetto '+i+':'+obj.DESCRIZIONE+'</span><span><i class="fa fa-save" hid="'+obj.HID+'" onclick="SalvaQuesto(this);"></i></span></div>'); */
        var vista=getCurrentVista('RICERCAGENERICA');
        var lista=[];
        var table=renderTable('TabellaMauro',obj,lista,vista,undefined,25);
            //$(ric).append(cont);
            //applyFormRecord(cont,bom);
            $(ric).append(table);
            //$(table).css({'width':'1200px','max-width':'1200px','margin-left':'30px'});
            $(table).css({'margin-left':'30px'});
            $(ric).find('.dataTables_paginate').removeClass('float-right');
            $(ric).find('[tipo="cardTabella_pageOne"]').css('display','');
            $(ric).find('[tipo="campiricerca"]').css('display','');
            $(ric).find('[tipo="campiricerca"]').find('input').attr('oninput','searchF2(this);');
            $(ric).find('[tipo="campiricerca"]').find('input').attr('hid',obj.hid);
            $(table).find('[tipo="TITOLO"]').html('Ricerca Forme Salvate');
       hopnotify('Ricerca generica',ric);
}
var qryincorso={};

async function searchF2(el){
	var tblcont=$(el).closest('[tipo="tabella"]');
    var id='QRY'+generateID();
    var idq='searchF2';
	qryincorso[idq]=id;
	var phrase=$(el).val();
	var max=1800;
	var query={};
	var campo=undefined;
	if (campo==undefined){
			query._ALL=phrase;
			//query.DESCRIZIONE=phrase;
	}else{
			query[campo]=phrase;
    }
    query='{DESCRIZIONE:{$regex:"'+phrase+'","$options" : "i"}}';
	consolelog('RICERCA:'+phrase+' : '+JSON.stringify(query));
   // var ret=await Risorsa.aquery('OBJ3D',query,undefined,undefined,undefined,'{DESCRIZIONE:1,OBJECT.object.type:1}');
    var ret=await Risorsa.aquery('OBJ3D',query,undefined,undefined,undefined,'{DESCRIZIONE:1,_CLOK:1}');
//	var ret=await Risorsa.asearch('BOMPR7','');
	if (ret.Esito=='OK'){
		consolelog('_STATO_SEARCHACTIVE:'+ret._SEARCHACTIVE);
		if (qryincorso[idq]==id){ 
			qryincorso[idq]='ENDED';
			var lst=ret.LISTA;
			var tbl=$(tblcont).find('table');
			var idtbl=$(tbl).attr('id');
			
			//var tblogg=Risorsa.get(idtbl);
			
            redrawTable($(tbl).find('thead'),lst);
			
		}else{
			consolelog('Vecchia richiesta - ignorata');
		}
	}
}

async function addPointsObject(){
    var geoPunti=new THREE.BufferGeometry();
    geoPunti.setFromPoints([]);
    var matp = new THREE.PointsMaterial( { color: 0xff0000,sizeAttenuation:false,size:10.0 } );
    var Pts=new THREE.Points(geoPunti,matp);
    Pts.name="Punti. Rinominare prego.";
    scene.add(Pts);
    aggiornaPannello();

}

async function addPointsObjectFromSel(){
    var geoPunti=new THREE.BufferGeometry();
    geoPunti.setFromPoints(selPoints);
    var matp = new THREE.PointsMaterial( { color: 0xff0000,sizeAttenuation:false,size:10.0 } );
    var Pts=new THREE.Points(geoPunti,matp);
    Pts.name="Punti da Selezione. Rinominare prego.";
    scene.add(Pts);
    aggiornaPannello();

}

async function caricaOggetto(el){
    var hid=$(el).attr('hid');
    var loader=new THREE.ObjectLoader();
    r=await Risorsa.aload(hid);
     if (r!=undefined){
         console.log('Caricato Oggetto:'+hid);
         var ogg=undefined;
         var ogg=await loader.parse(r.OBJECT);
       
         
         if (ogg!=undefined){
           // ogg.HID=r.HID;
            r.OBJECT=ogg;
            loggetti[ogg.uuid]=r;
            scene.add(ogg);
            console.log('Caricato OGGETTO!!!:'+ hid+":"+ogg.name);
         }else{
             console.log('Errore nel parsing:'+ogg+' '+JSON.stringify(ogg));
         }
     } 
     aggiornaPannello();
}

async function fGridY(){
    var size = 100;
    var divisions = 0.1;
    var gridXZ = new THREE.GridHelper(200, 200);
   scene.add( gridXZ );
   aggiornaPannello();
}
async function fGrid(){
 var gridXY = new THREE.GridHelper(200, 200);
 gridXY.rotation.x = Math.PI/2;
 //gridXY.position.set(5,5,0);
 //gridXY.setColors( new THREE.Color(0xff0000), new THREE.Color(0xffffff) );
 scene.add(gridXY);
}

async function fGridX(){
    var gridYZ = new THREE.GridHelper(200, 200);
    gridYZ.rotation.z = Math.PI/2;
    //gridXY.position.set(5,5,0);
   // gridYZ.setColors( new THREE.Color(0xff0000), new THREE.Color(0xffffff) );
    scene.add(gridYZ);
   }

function fAxes(){
    var axes = new THREE.AxesHelper(100);
    scene.add(axes);
}

async function fRotateX(el){
    var obj=getObjEl(el);
    if (obj!=undefined){
        var ob=obj.OBJECT;
        ob.rotation.x = Math.PI/2;
        ob.updateMatrix();
    }

}

async function fRotate(el){
    var obj=getObjEl(el);
    if (obj!=undefined){
        var ob=obj.OBJECT;
        var rotCfg=new Risorsa('ROTCFG');

        rotCfg.ROTX=ob.rotation.x/(Math.PI/2);
        rotCfg.ROTY=ob.rotation.y/(Math.PI/2);
        rotCfg.ROTZ=ob.rotation.z/(Math.PI/2);

        var panel=$.parseHTML(getServerModule('Takeup','ROTATE_CFG'));
        applyFormRecord(panel,rotCfg);
        var yesno=await hopconfirm('Rotazione oggetto',panel);
        if (yesno){

            
            var v1 =rotCfg.ROTX;
            var v2 =rotCfg.ROTY;
            var v3 =rotCfg.ROTZ;
            
           
        ob.rotation.x = v1*Math.PI/2;
        ob.rotation.y = v2*Math.PI/2;
        ob.rotation.z = v3*Math.PI/2;
        ob.updateMatrix();
    }
}

}

async function fScale(el){
    var obj=getObjEl(el);
    if (obj!=undefined){
        var ob=obj.OBJECT;
        var rotCfg=new Risorsa('ROTCFG');

        rotCfg.ROTX=ob.scale.x;
        rotCfg.ROTY=ob.scale.y;
        rotCfg.ROTZ=ob.scale.z;

        var panel=$.parseHTML(getServerModule('Takeup','ROTATE_CFG'));
        applyFormRecord(panel,rotCfg);
        var yesno=await hopconfirm('Scaling Oggetto',panel);
        if (yesno){

            
            var v1 =rotCfg.ROTX;
            var v2 =rotCfg.ROTY;
            var v3 =rotCfg.ROTZ;
            
           
        ob.scale.x = v1;
        ob.scale.y = v2;
        ob.scale.z = v3;
        ob.updateMatrix();
    }
}

}

async function freeScene(){
    var yesno=await hopconfirm('Nuova Scena','Vuoi eliminare tutti gli oggetti e creare una nuova scena?');
    if (yesno){
    for (var i=0;i< scene.children.length;i++){
        var obj=scene.children[i];
        if (obj.type!="DirectionalLight"){
            scene.remove(obj);
            i=i-1;
        }
       
    }
    aggiornaPannello();
    }
}


PrismGeometry = function ( vertices, height ) {

    var Shape = new THREE.Shape();

    ( function f( ctx ) {

        ctx.moveTo( vertices[0].x, vertices[0].y );
        for (var i=1; i < vertices.length; i++) {
            ctx.lineTo( vertices[i].x, vertices[i].y );
        }
        ctx.lineTo( vertices[0].x, vertices[0].y );

    } )( Shape );

    var settings = { };
    settings.amount = height;
    settings.bevelEnabled = true;
    THREE.ExtrudeGeometry.call( this, Shape, settings );

};

PrismGeometry.prototype = Object.create( THREE.ExtrudeGeometry.prototype );