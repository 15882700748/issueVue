<template>
    <div class="loading_container" id="loading">
        <div class='ring blue'></div>
        <div id="loading_content">
            <span>{{text}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        props:['text'],
        name: "LoadingComp"
    }
</script>

<style scoped>
    @-webkit-keyframes rotate {
        from { -webkit-transform: rotate(0deg) }
        to { -webkit-transform: rotate(360deg) } }
    @-moz-keyframes rotate {
        from { -moz-transform: rotate(0deg) }
        to { -moz-transform: rotate(360deg) } }
    @-o-keyframes rotate {
        from { -o-transform: rotate(0deg) }
        to { -o-transform: rotate(360deg) } }
    @keyframes rotate {
        from { transform: rotate(0deg) }
        to { transform: rotate(360deg) } }

    @-webkit-keyframes fade {
        from { opacity: 1 }
        50% { opacity: 0 }
        to { opacity: 1 } }
    @-moz-keyframes fade {
        from { opacity: 1 }
        50% { opacity: 0 }
        to { opacity: 1 } }
    @-o-keyframes fade {
        from { opacity: 1 }
        50% { opacity: 0 }
        to { opacity: 1 } }
    @keyframes fade {
        from { opacity: 1 }
        50% { opacity: 0 }
        to { opacity: 1 } }

    #loading {
        display: block;
        width: 150px;
        height: 150px;
        /* PRESENTATIONAL PURPOSES */
        margin: auto;
        position: absolute;
        top: 45%; left: 50%;
        transform: translate(-50%,-45%);
        /**/
        cursor: pointer;
        -webkit-user-select: none;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        -webkit-box-shadow: 0 0 0 6px #222,
        0 0 6px 10px #444;
        -moz-box-shadow: 0 0 0 6px #222,
        0 0 6px 10px #444;
        box-shadow: 0 0 0 6px #222,
        0 0 6px 10px #444
    }

    /* TEXT */
    #loading_content {
        background: #222;
        background: -webkit-linear-gradient(#222,#111);
        background: -moz-linear-gradient(#222,#111);
        background: -o-linear-gradient(#222,#111);
        background: linear-gradient(#222,#111);
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        text-align: center;
        font: normal normal normal 12px/140px
        'Electrolize', Helvetica, Arial, sans-serif;
        color: #fff;
    }

    #loading_content span {
        vertical-align: middle;
        -webkit-animation: fade 1s linear infinite;
        -moz-animation: fade 1s linear infinite;
        -o-animation: fade 1s linear infinite;
        animation: fade 1s linear infinite
    }

    /* SPINNING GRADIENT */
    .ring {
        margin: 0 auto;
        border-radius: 110px;
        padding: 10px;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        -webkit-animation: rotate 1s linear infinite;
        -moz-animation: rotate 1s linear infinite;
        -o-animation: rotate 1s linear infinite;
        animation: rotate 1s linear infinite
    }

    /* COLORS */
    .green {
        background: -webkit-linear-gradient(#bfff00,transparent,#bfff00);
        background: -moz-linear-gradient(#bfff00,transparent,#bfff00);
        background: -o-linear-gradient(#bfff00,transparent,#bfff00);
        background: linear-gradient(#bfff00,transparent,#bfff00)
    }

    .blue {
        background: -webkit-linear-gradient(#3cf,transparent,#3cf);
        background: -moz-linear-gradient(#3cf,transparent,#3cf);
        background: -o-linear-gradient(#3cf,transparent,#3cf);
        background: linear-gradient(#3cf,transparent,#3cf)
    }

    .red {
        background: -webkit-linear-gradient(#cd5c5c,transparent,#cd5c5c);
        background: -moz-linear-gradient(#cd5c5c,transparent,#cd5c5c);
        background: -o-linear-gradient(#cd5c5c,transparent,#cd5c5c);
        background: linear-gradient(#cd5c5c,transparent,#cd5c5c)
    }

    .purple {
        background: -webkit-linear-gradient(#e166e1,transparent,#e166e1);
        background: -moz-linear-gradient(#e166e1,transparent,#e166e1);
        background: -o-linear-gradient(#e166e1,transparent,#e166e1);
        background: linear-gradient(#e166e1,transparent,#e166e1)
    }
</style>