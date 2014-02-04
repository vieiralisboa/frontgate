<?php

// Bar Constructor
//-----------------------------------------------------------------------------
class Bar {
	
	// bar container template
	public $container = '<div id="%id%" class="bar-container">%bar-container%</div>';	
	
	// bar template
	public $bar = '<div class="bar">%bar%</div>';

	// bar items template
	public $items = '<ul>%bar-items%</ul>';
	
	// bar item template
	public $item = '<li>%bar-item%</li>';
	
	// bars array
	public $bars = array();

	// bars getter
	public function bars(){
		return implode("\n", $this->bars);
	}

	// bar renderer
	public function bar($data, $id){
		$items = $this->items($data->items);
		$bar = str_replace('%bar%', $items, $this->bar);
		$container = str_replace('%id%', $id, $this->container);
		$container = str_replace('%bar-container%', $bar, $container);
		$this->bars[] = $container;
		return $container;
	}
	
	// bar items renderer
	protected function items($items){
		$bar_items = array();
		foreach ($items as $key => $item) {
			$bar_items[] = $this->item($item);
		}
		
		return str_replace('%bar-items%', implode("", $bar_items), $this->items);
	}
	
	// bar item renderer
	protected function item($item){
		$el = isset($item->el)? $item->el : "a";
		$text = isset($item->text)? $item->text : $item->html;
		$attr = array();
		if(isset($item->attr)){
			foreach ($item->attr as $key => $value) {
				$attr[] = "$key=\"$value\"";
			}
		} 
		return  str_replace('%bar-item%', "<$el " . implode(" ",$attr) . ">$text</$el>", $this->item);
	}
	
	// starter
	function __construct($data){
		if(isset($data)) 
			foreach($data as $id => $bar)
				$this->bar($bar, $id);
	}
}