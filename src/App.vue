<template>
  <div>
    <div class="flex mb-0">
      <div class="w-1/2 bg-gray-100 h-full p-8">
          
          <div class="flex mb-5 pb-5 border-b items-center">
            <img class="w-10 h-10 mr-4" src="./logo.png" alt="Logo" />
            <h2 class="text-lg font-bold">Squicle Creator</h2>
          </div>
          
          <div class="w-full mb-5 flex items-center">
            <span class="text-gray-600 w-1/4 text-sm mr-3">Width:</span>
            <vue-slider :tooltip="'none'" class="flex-grow w-3/4" v-model="w" :min="Min.w" :max="Max.w" :interval="5"></vue-slider>
            <span class="bg-gray-300 text-gray-800 w-8 py-1 text-center text-xs ml-2 flex-shrink-0 rounded">{{w}}</span>
          </div>

          <div class="w-full mb-5 flex items-center">
            <span class="text-gray-600 w-1/4 text-sm mr-3">Height:</span>
            <vue-slider :tooltip="'none'" class="flex-grow w-3/4" v-model="h" :min="Min.h" :max="Max.h" :interval="5"></vue-slider>
            <span class="bg-gray-300 text-gray-800 w-8 py-1 text-center text-xs ml-2 flex-shrink-0 rounded">{{h}}</span>
          </div>

          <div class="w-full mb-5 flex items-center">
            <span class="text-gray-600 w-1/4 text-sm mr-3">Corner-x:</span>
            <vue-slider :tooltip="'none'" class="flex-grow w-3/4" v-model="rx" :min="Min.rx" :max="Max.rx"></vue-slider>
            <span class="bg-gray-300 text-gray-800 w-8 py-1 text-center text-xs ml-2 flex-shrink-0 rounded">{{rx}}</span>
          </div>

          <div class="w-full mb-5 flex items-center">
            <span class="text-gray-600 w-1/4 text-sm mr-3">Corner-Y:</span>
            <vue-slider :tooltip="'none'" class="flex-grow w-3/4" v-model="ry" :min="Min.ry" :max="Max.ry"></vue-slider>
            <span class="bg-gray-300 text-gray-800 w-8 py-1 text-center text-xs ml-2 flex-shrink-0 rounded">{{ry}}</span>
          </div>

          <div class="w-full mt-5 pt-5 border-t flex justify-between">
            <button class="bg-blue-500 hover:bg-blue-700 text-xs text-white font-bold py-2 px-5 rounded" @click="create">Create</button>
            <button class=" text-gray-500 bg-wite hover:bg-gray-200 text-xs text-white font-bold py-1 px-4 rounded" @click="cancel">Cancel</button>
          </div>
      </div>
      <div class="w-1/2 bg-gray-200 h-full">
        <div class="w-full h-full p-5 flex items-center justify-center overflow-auto">
          <div class="squircle bg-green-400" v-bind:style="{clipPath:clipPath, width:w+ 'px', height:h+ 'px'}"></div>
          <button @click="showCSS =! showCSS" class=" switch-btn py-1 px-3 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded" v-html="showCSS?'Preview':'CSS'"></button>
          <button 
            v-clipboard:copy="css"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError" 
            v-show="showCSS"
            class="copy-to-clipboard py-1 px-3 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded">{{copyText}}</button>
          <div :class="{'show-me': showCSS}" class="font-mono css w-2 h-2 bg-gray-200 text-xs  text-gray-600 w-full h-full"><pre>{{css}}</pre></div>
        </div>
      </div>
    </div>
    
    
  </div>
</template>

<script>

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
export default {
  name: "App",
  components: {
    VueSlider
  },
  data() {
    return {
      copyText: "Copy!",
      showCSS: false,
      Min:{
        w:20,
        h:20,
        rx:0,
        ry:0
      },
      Max: {
        w:250,
        h:250,
        rx:30,
        ry:30
      },
      w:100,
      h:100,
      rx:4,
      ry:4
    };
  },
  computed:{
    css(){
      return `
div { 
  width: ${this.w}px;
  height: ${this.h}px;
  background-color: #68d391;
  clip-path: ${this.clipPath};
}`;
    },
    clipPath(){
      let width = this.w;
      let height = this.h;
      let radiusX = this.rx;
      let radiusY = this.ry;

      const squircleMaker = (radiusX, radiusY) => (theta) => ({
        x: Math.pow(Math.abs(Math.cos(theta)), 2 / radiusX) * 50 * Math.sign(Math.cos(theta)) + 50,
        y: Math.pow(Math.abs(Math.sin(theta)), 2 / radiusY) * 50 * Math.sign(Math.sin(theta)) + 50
      });

      let path = (new Array(359))
        .fill(0)
        .map((x, i) => i)
        .map((counter)=>counter * Math.PI / 180)
        .map(squircleMaker(radiusX, radiusY))
        .map(({ x, y }) => ({ x: Math.round(x * 10)/10, y: Math.round(y * 10)/10 }))
        .map(({x,y}) => `${x}% ${y}%`)
        .join(', ')

      return `polygon(${path})`
    }
  },
  methods: {
    create: function() {
      

      parent.postMessage(
        { pluginMessage: { type: "create-squircle", w:this.w, h:this.h, rx:this.rx, ry:this.ry } },
        "*"
      );
    },
    cancel: function() {
      parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
    },
    onCopy: function (e) {
      this.copyText = "Copied! Have Fun!";

      setTimeout(()=>{
        this.copyText = "Copy!";
      },3000);
      
    },
    onError: function (e) {
      this.copyText = "Error!";

      setTimeout(()=>{
        this.copyText = "Copy!";
      },3000);
    }
  },
  created() {}
};
</script>

<style>
  .copy-to-clipboard{
    position: fixed;
    z-index: 10;
    right:20px;
    top:20px;
  }
  .switch-btn{
    position: fixed;
    z-index: 10;
    right:20px;
    bottom:20px;
  }
  .css{
    visibility: hidden;
    opacity: 0;
    position: fixed;
    top: 0;
    left: 50%;
    width: 50%;
    padding: 2rem;
    overflow: auto;
    transition: all 0.2s ease;
  }
  .css.show-me{
    visibility: visible;
    opacity: 1;
  }
  .css pre{
    font-size: 85%;
  }
  .squircle{
    transition: all 0.2s ease;
  }
</style>