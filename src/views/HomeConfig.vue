<template>
    <div class="wrapper" ref="text">
        {{info.position.x}},{{info.position.y}}||{{info.position.width}},{{info.position.height}}
        <div id="div1" v-drag="{set:set}" class="drag">
            div1
        </div>
        <div id="div2" v-drag="{set:set}"style="left: 100px;" class="drag">
            div2
        </div>
        <div id="div3" v-drag="{set:set}" style="left: 200px;" class="drag">
            div3
        </div>
    </div>
</template>

<script>
    export default {
        name:'HomeConfig',
        data(){
            return {
                x:'',
                y:'',
                info:{
                    category:'',
                    name:'',
                    style:{},
                    position:{}
                }
            }
        },
        directives:{
            drag(el,bindings){
                let _this = this
                // info.parent = parent
                el.onmousedown = function(e){
                    let disx = e.pageX - el.offsetLeft,
                        disy = e.pageY - el.offsetTop,
                        info ={category:'', name:'', style:{}, position:{}},
                        parent = el.parentElement,
                        brothers = [],
                        brotherNodes,
                        brothersInfo = [],
                        elWidth = el.clientWidth,
                        elHeight =el.clientHeight,
                        width,height
                    if(parent !== null){
                        width = parent.clientWidth-elWidth
                        height = parent.clientHeight-elHeight
                        brotherNodes = parent.children
                        //获取兄弟节点
                        for(let i=0;i<brotherNodes.length;i++){
                            if(brotherNodes[i]!== el){
                                brothers.push(brotherNodes[i])
                            }
                        }
                        //放兄弟节点信息
                        brothers.forEach(function(item){
                            brothersInfo.push({
                                'left':parseInt(item.style.left),
                                'top':parseInt(item.style.top),
                                'id':item.id,
                                'clientWidth':item.clientWidth,
                                'clientHeight':item.clientHeight
                            })
                        })

                    }else{
                        width = 600
                        height = 500
                    }
                    document.onmousemove = function (e){
                        let x = e.pageX - disx
                        let y = e.pageY - disy
                        //判断边缘
                        x = x < 0 ? 0 : x;
                        x = x > width ? width : x
                        y = y < 0 ? 0 : y;
                        y = y > height ? height : y
                        //判断相交
                        try{
                            //forEach无法跳出循环。只能用try的方法
                            brothersInfo.forEach(function(item){
                                let itemTop=item.top
                                let itemLeft=item.left

                                // console.log('在obj上',x+elHeight < itemTop)
                                // console.log('在obj下',x >itemTop+item.clientHeight)
                                // console.log('在obj左',y+elWidth < itemLeft)
                                // console.log('在obj右',y >itemLeft+item.clientWidth)
                                // x = x + elHeight > itemTop ? itemTop : x
                                // console.log(ftop+300<btop||ftop>btop+300||fleft+400<bleft||fleft>bleft+400)

                                if(x+0 < itemTop||x >itemTop+item.clientHeight || y+0 < itemLeft||y >itemLeft+item.clientWidth){
                                    console.log("和所有兄弟都不相交")
                                }else{
                                    //console.log(x,y,itemTop,itemLeft,item.clientWidth,item.clientHeight)
                                    console.log(el.id,"和某个兄弟相交:",item.id)
                                    console.log('在obj上',x+0 < itemTop)
                                    console.log('在obj下',x >itemTop+item.clientHeight)
                                    console.log('在obj左',y+0 < itemLeft)
                                    console.log('在obj右',y >itemLeft+item.clientWidth)
                                     console.log(el.id,x,y,item.id,itemTop,itemLeft)
                                    // console.log()
                                }
                            })
                        }catch(e){

                        }
                        el.style.left =x +'px';
                        el.style.top = y+'px';
                        info.position.x = x;
                        info.position.y = y
                        info.position.width = width;
                        info.position.height = height
                        bindings.value.set(info)
                    }
                    document.onmouseup = function(){
                        document.onmousemove = document.onmouseup = null;
                    }
                }
            }
        },
        methods: {
            set(val){
                this.info= val
            }
        }
    }
</script>

<style  scoped>
    .wrapper{
        width: 100%;
        height: 600px;
        position: relative;
        border: 1px black solid;
    }
    .drag{
        width: 100px;
        height: 100px;
        position: absolute;
        color: white;
        align-content: center;
        top: 0;
        left: 0;
        background-color: red;
    }
</style>

