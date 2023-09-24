import dragDrop from './drag-drop.js';
import instrument from './instrument.js';
import store from './store.js';
import timeline from './timeline.js';

store.init({
    paths: [],
    selectedPath: null,
});

timeline.initTimeline();

timeline.selectPath(store.get('paths.0.id'));
dragDrop.initListeners();
instrument.initListeners();
