import * as THREE from '@modules/three/three.module.js'
import {OBJLoader} from '@modules/three/OBJLoader.js'

let buvosKockaContainer = document.querySelector('.buvos-kocka');
if (buvosKockaContainer){


let renderer = new THREE.WebGLRenderer({ antialias: true });
buvosKockaContainer.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );

const scene = new THREE.Scene();

let width = 30;
let height = width * ( window.innerHeight / window.innerWidth );
const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 200 );

scene.background = new THREE.Color( 0xeeeeeee );
camera.position.set(60, 51, 61);
camera.rotation.set(-0.696, 0.648, 0.467);

// Освещение
let topShadowDirectionalLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
topShadowDirectionalLight.castShadow = true;
topShadowDirectionalLight.shadow.radius = 60;
topShadowDirectionalLight.shadow.mapSize.width = 4096;
topShadowDirectionalLight.shadow.mapSize.height = 4096;
scene.add(topShadowDirectionalLight);
//
let sideDirectionalLite = new THREE.DirectionalLight( 0xffffff, 0.25);
sideDirectionalLite.position.set( 1, 0, 0 );
sideDirectionalLite.castShadow = true;
scene.add(sideDirectionalLite);
//
let ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 ); 
scene.add( ambientLight );

// Плоскость для тени
let plane = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10, 1, 1 ), new THREE.ShadowMaterial({opacity:0.1}));
plane.rotation.x = -Math.PI/2;
plane.position.set( 2, -3, 2 );
plane.receiveShadow = true;
scene.add(plane);

let buvosKocka = new THREE.Object3D();
buvosKocka.name = "buvosKocka";
scene.add(buvosKocka);

const objLoader = new OBJLoader();

objLoader.load(require('@static/models/cube.obj').default, ( cube ) => {
    cube.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = new THREE.MeshPhongMaterial
            ({
                color: 0x555555, 
            });
            child.castShadow = true;
        }
    } );
    objLoader.load(require('@static/models/sticker.obj').default, ( sticker ) => {
        createBuvosKocka( buvosKocka, cube, sticker, 5, [0xffb611, 'yellow', 'green', 0xff0000, 0xffffff, 0x28DAFB ] );
        //TODO: вместо генерации материала для каждого блока генерировать материал только для каждого цвета
    });
});

function createBuvosKocka( target, cubeModel, stickerModel, size, colors){
    let sideWrapper = new THREE.Mesh(
                        new THREE.BoxGeometry(size, size, size),
                        new THREE.MeshPhongMaterial({opacity:0, transparent: true, alphaTest: 1})
                    ); 
    sideWrapper.name = "sideWrapper";
    
    target.add(sideWrapper);

    function createBuvosKockaBlock(position){
        let cube = cubeModel.clone();
        cube.position.set(position.x - size/2 + 0.5, position.y - size/2 + 0.5, position.z-size/2  + 0.5);
        sideWrapper.add(cube);

        if ( position.x == 0){
            let sticker = stickerModel.clone();
            sticker.position.set(-0.5, 0, 0);

            sticker.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = new THREE.MeshPhongMaterial
                    ({
                        color: colors[0]
                    });
                }
            } );

            cube.add(sticker);
        }
        if ( position.x == size-1 ){
            let sticker = stickerModel.clone();
            sticker.position.set(+0.5, 0, 0);

            sticker.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = new THREE.MeshPhongMaterial
                    ({
                        color: colors[1]
                    });
                }
            } );

            cube.add(sticker);
        }
        if ( position.y == 0 ){
            let sticker = stickerModel.clone();
            sticker.rotation.z = Math.PI/2;
            sticker.position.set(0, -0.5, 0);

            sticker.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = new THREE.MeshPhongMaterial
                    ({
                        color: colors[2]
                    });
                }
            } );

            cube.add(sticker);
        }
        if ( position.y == size-1 ){
            let sticker = stickerModel.clone();
            sticker.rotation.z = Math.PI/2;
            sticker.position.set(0, +0.5, 0);

            sticker.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = new THREE.MeshPhongMaterial
                    ({
                        color: colors[3]
                    });
                }
            } );

            cube.add(sticker);
        }
        if ( position.z == 0 ){
            let sticker = stickerModel.clone();
            sticker.rotation.y = Math.PI/2;
            sticker.position.set(0, 0, -0.5);

            sticker.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = new THREE.MeshPhongMaterial
                    ({
                        color: colors[4]
                    });
                }
            } );

            cube.add(sticker);
        }
        if ( position.z == size-1 ){
            let sticker = stickerModel.clone();
            sticker.rotation.y = Math.PI/2;
            sticker.position.set(0, 0, +0.5);

            sticker.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = new THREE.MeshPhongMaterial
                    ({
                        color: colors[5]
                    });
                }
            } );

            cube.add(sticker);
        }
    }

    for (let x = 0; x < size; x++){
        for (let y = 0; y < size; y++){
            createBuvosKockaBlock( {x: x, y: y, z: 0} );
            createBuvosKockaBlock( {x: x, y: y, z: size-1} );
        }
    }

    for (let x = 0; x < size; x++){
        for (let z = 1; z < size-1; z++){
            createBuvosKockaBlock( {x: x, y: 0, z: z} );
            createBuvosKockaBlock( {x: x, y: size-1, z: z} );
        }
    }

    for (let y = 1; y < size-1; y++){
        for (let z = 1; z < size-1; z++){
            createBuvosKockaBlock( { x: 0, y: y, z: z } );
            createBuvosKockaBlock( { x: size - 1, y: y, z: z } );
        }
    }
}

let rotateAroundParentAxis = function(object, axis, radians) {
    let rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    let currentPos = new THREE.Vector4(object.position.x, object.position.y, object.position.z, 1);
    let newPos = currentPos.applyMatrix4(rotWorldMatrix);

    rotWorldMatrix.multiply(object.matrix);
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);

    object.position.set(newPos.x, newPos.y, newPos.z);
};

function selectSimilarPosition( array, position, isX = true, isY = true, isZ = true, inaccuracy = 0.2 ){
    let similarArray = [];

    array.forEach(element => {
        if ((!isX || (Math.abs(element.position.x - position.x) < inaccuracy))
        && (!isY || (Math.abs(element.position.y - position.y) < inaccuracy))
        && (!isZ || (Math.abs(element.position.z - position.z) < inaccuracy))) {
            similarArray.push(element);
        }
    });


    return similarArray;
}

function easeInOutCubic(x){
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function shuffleBuvosKocka( count, startDuration, endDuration, transitionCount ){
    let currentCount = 0;
    if (!canRotate)
        return;

    let cubes = buvosKocka.getObjectByName("sideWrapper").children;

    function cycle(){
        if ( currentCount > count ){
            canRotate = true;
            return;
        }
        canRotate = false;

        let randomNumber = ~~(Math.random() * cubes.length);
        let randomCube = cubes[randomNumber];

        randomNumber = ~~(Math.random()*3);
        let randomSide = selectSimilarPosition( cubes, randomCube.position, randomNumber == 0, randomNumber == 1, randomNumber == 2);
        requestAnimationFrame( 
            rotateObjects(  
                randomSide, 
                new THREE.Vector3(randomNumber == 0, randomNumber == 1, randomNumber == 2),

                endDuration+(1-(currentCount > transitionCount? 1: currentCount/transitionCount))*(startDuration-endDuration),
                cycle
            )
        );
        currentCount++;
    }
    cycle();
}

function rotateObjects( rotationBlocks, direction, duration, afterEnd = null ){
    let startTime = performance.now();
    let step = 0;
    return function rotate( currentTime ){
        let lastStep = step;
        step = easeInOutCubic( ( currentTime - startTime ) / duration );

        if (step < 1) requestAnimationFrame( rotate ); else {
            step = 1;}
        
        rotationBlocks.forEach(element => {
            rotateAroundParentAxis(element, direction, Math.PI/2*(step-lastStep));
        });

        if (step == 1){
            canRotate = true;
            if (typeof(afterEnd) == 'function')
                afterEnd();
        };
    }
}

let canRotate = true;
// Управление мышью
const raycaster = new THREE.Raycaster();
//
let mouseDownPosition = new THREE.Vector2();
document.addEventListener('mousedown', function (event) {
    mouseDownPosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouseDownPosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouseDownPosition, camera );
});
//
let mouseUpPosition = new THREE.Vector2();
document.addEventListener('mouseup', function (event) {
    mouseUpPosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouseUpPosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    if (!canRotate)
        return;
    let mouseDiff = new THREE.Vector2();
    mouseDiff.subVectors(mouseUpPosition, mouseDownPosition);

    let intersect = raycaster.intersectObjects( scene.children, true )

    let block = null;
    let intersectSide = null;
    // Поиск первого элемента на пути луча (кроме sideWrapper)
    intersect.some( function( element ) {
        if (element.object.name != "sideWrapper"){
            block = element.object;
            return true;
        }
        return false;
    });
    // Поиск sideWrapper на пути луча
    intersect.some( function( element ) {
        if (element.object.name == "sideWrapper"){
            intersectSide = element.face.normal;
            return true;
        }
        return false;
    });

    while (block?.parent && block?.parent.name != "sideWrapper")
        block = block.parent;

    if (block && block.parent?.name == "sideWrapper"){
        canRotate = false;

        let direction = new THREE.Vector3(0,0,0);
        let rotationBlocks = []
        let sideWrapper = buvosKocka.getObjectByName("sideWrapper");

        // Вращение в зависимости от выбранной грани
        // Верхняя грань
        if (intersectSide.x == 0 && intersectSide.y == 1 && intersectSide.z == 0){
            if (0 < mouseDiff.angle() && mouseDiff.angle() < Math.PI / 2 || Math.PI < mouseDiff.angle() && mouseDiff.angle() < Math.PI * 3 / 2 ){
                rotationBlocks = selectSimilarPosition(sideWrapper.children, block.position, true, false, false)
                direction.set(mouseDiff.x > 0? -1 : 1, 0, 0);
            }
            else{
                rotationBlocks = selectSimilarPosition(sideWrapper.children, block.position, false, false, true)
                direction.set(0, 0, mouseDiff.x > 0? -1 : 1);
            }
        }
        // Левая грань
        if (intersectSide.x == 0 && intersectSide.y == 0 && intersectSide.z == 1){
            if (Math.PI / 9 < mouseDiff.angle() && mouseDiff.angle() < Math.PI*8/9 || Math.PI*10/9 < mouseDiff.angle() && mouseDiff.angle() < Math.PI*17/9 ){
                rotationBlocks = selectSimilarPosition(sideWrapper.children, block.position, true, false, false)
                direction.set( mouseDiff.y > 0? -1: 1, 0, 0);
            }
            else{
                rotationBlocks = selectSimilarPosition(sideWrapper.children, block.position, false, true, false)
                direction.set(0, mouseDiff.x > 0? 1: -1, 0);
            }
        }
        // Правая грань
        if (intersectSide.x == 1 && intersectSide.y == 0 && intersectSide.z == 0){
            if (Math.PI / 9 < mouseDiff.angle() && mouseDiff.angle() < Math.PI*8/9 || Math.PI*10/9 < mouseDiff.angle() && mouseDiff.angle() < Math.PI*17/9 ){
                rotationBlocks = selectSimilarPosition(sideWrapper.children, block.position, false, false, true)
                direction.set( 0, 0, mouseDiff.y > 0? 1: -1);
            }
            else{
                rotationBlocks = selectSimilarPosition(sideWrapper.children, block.position, false, true, false)
                direction.set(0, mouseDiff.x > 0? 1: -1, 0);
            }
        }

        requestAnimationFrame(rotateObjects( rotationBlocks, direction, 1000));
    }
});


// Управление клавиатурой
// Вращение кубика рубика
//  Q - Влево вверх
//  W - Вправо
//  E - Вправо вверх
//  С зажатым shif - в обратную сторону
document.addEventListener('keydown', function( event ){
    let direction = new THREE.Vector3(0,0,0);
    let sideWrapper = buvosKocka.getObjectByName("sideWrapper");

    rotateObjects(sideWrapper.children, direction, 1000);

    if (["KeyQ", "KeyW", "KeyE"].indexOf(event.code) > -1 && canRotate){
        switch( event.code ){
            case 'KeyQ': 
                direction.set( 0, 0, event.shiftKey == 1? -1: 1 );
                break;
            case 'KeyW':
                direction.set( 0, event.shiftKey == 1? -1: 1, 0 );
                break;
            case 'KeyE':
                direction.set( event.shiftKey == 1? 1: -1, 0, 0);
                break;
        }
        canRotate = false;
        requestAnimationFrame(rotateObjects(sideWrapper.children, direction, 1000));
    }
    if (event.code=="KeyR")
        shuffleBuvosKocka(20, 400, 100, 12)
});

// Куб двигается вверх и вниз
function buvosKockaFly( time ){
    buvosKocka.position.y = Math.sin( time * 0.001 ) * 0.2;
    plane.material.opacity = 1 - ( Math.sin( time * 0.001 ) * 0.07 + 0.9);
    requestAnimationFrame(buvosKockaFly);
}
requestAnimationFrame(buvosKockaFly);

let buvosKockaTimer = document.querySelector('.buvos-kocka__timer');
function stopwatch ( time ){
    buvosKockaTimer.textContent = (~~(time/1000/60)).toString().padStart(2, '0') + "." + 
                                (~~(time/1000)%60).toString().padStart(2, '0') + "." +
                                (~~(time/10)%100).toString().padStart(2, '0');

    requestAnimationFrame(stopwatch);
}
requestAnimationFrame(stopwatch);

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};
animate();

}