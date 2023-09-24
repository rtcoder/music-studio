import dragDrop from './drag-drop.js';
import instrument from './instrument.js';
import store from './store.js';
import timeline from './timeline.js';

store.init({
    paths: [],
    selectedPath: null,
    progressPosition: 0,
    msProgress: 0,
    isPlaying: false,
    startPlayTime: null,
    loopTime: 2000,
    loopEnabled:false
});

timeline.initTimeline();

timeline.selectPath(store.get('paths.0.id'));
dragDrop.initListeners();
instrument.initListeners();
timeline.playTimeline();
console.log(store.get('loopTime'))
