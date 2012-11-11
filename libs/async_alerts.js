// Source of Script: http://javascript.nwbox.com/async_alerts.js.old on 31Oct2012

// inserAdjacent(HTML|Text) implementation for Mozilla/Firefox
if(typeof HTMLElement!='undefined'&&!HTMLElement.prototype.insertAdjacentElement){
	HTMLElement.prototype.insertAdjacentElement=function(where,parsedNode){
		switch(where){
			case 'beforeBegin':
				this.parentNode.insertBefore(parsedNode,this);
				break;
			case 'afterBegin':
				this.insertBefore(parsedNode,this.firstChild);
				break;
			case 'beforeEnd':
				this.appendChild(parsedNode);
				break;
			case 'afterEnd':
				if(this.nextSibling){
					this.parentNode.insertBefore(parsedNode,this.nextSibling);
				}else{
					this.parentNode.appendChild(parsedNode);
				}
				break;
		}
	};

	HTMLElement.prototype.insertAdjacentHTML=function(where,htmlStr){
		var r=this.ownerDocument.createRange();
		r.setStartBefore(this);
		var parsedHTML=r.createContextualFragment(htmlStr);
		this.insertAdjacentElement(where,parsedHTML);
	};

	HTMLElement.prototype.insertAdjacentText=function(where,txtStr){
		var parsedText=document.createTextNode(txtStr);
		this.insertAdjacentElement(where,parsedText);
	};
}

function Notifier(doc){
	var o=this;

	// save document we attach to
	o.doc=doc||document;

	// real alert function placeholder
	o._alert=null;

	// initialize Notifier Object
	o.init=function(){
		if(o._alert==null){
			// save old alert function
			o._alert=window.alert;
			// redefine alert function
			window.alert=function(s){
				notify(s)
			}
		}else{
			alert('[WARNING]: Notifier Object already enabled !!!');
		}
	}

	// shutdown Notifier Object
	o.shut=function(){
		if(o._alert!=null){
			// restore old alert function
			window.alert=o._alert;
			// unset placeholder
			o._alert=null;
		}else{
			alert('[WARNING]: Notifier Object already disabled !!!');
		}
	}

	// return Notifier Object
	return o;
}

function opacity(ss,s,e,m,f){
	if(s>e){
		s--;
	}else if(s<e){
		s++;
	}
	setOpacity(ss,s);
	if(s!=e){
		setTimeout(function(){opacity(ss,s,e,m,f);},Math.round(m/10));
	}else if(s==e){
		if(typeof f=='function'){f();}
	}
}

function setOpacity(s,o){
	s.opacity=o/100;
	s.MozOpacity=o/100;
	s.KhtmlOpacity=o/100;
	s.filter='alpha(opacity='+o+')';
}

// m=message,s=style
function notify(m,s){

	// we may consider adding frames support
	var w=window;

	// shortcut to document
	var d=document;

	// canvas, window width and window height
	var c=d.getElementsByTagName((d.compatMode&&d.compatMode=='CSS1Compat')?'HTML':'BODY')[0];
	var ww=w.innerWidth?w.innerWidth+w.pageXOffset:c.clientWidth+c.scrollLeft;
	var wh=w.innerHeight?w.innerHeight+w.pageYOffset:c.clientHeight+c.scrollTop;

	// create a block element
	var b=d.createElement('div');
	b.id='Message';
	b.className=s||'';
	b.style.top='-9999px';
	b.style.left='-9999px';
	b.style.position='absolute';
	b.style.whiteSpace='nowrap';

	// if we have not been passed a class
	if(b.className.length==0){
		b.style.margin='0px 0px';
		b.style.padding='8px 8px';
		b.style.border='1px solid #fff'; /// CHANGE
		b.style.backgroundColor='#fff'; ///  these for background color of notification
	}

	// append block to body
	b=d.body.appendChild(b);
	// write the HTML fragment to it
	b.insertAdjacentHTML('afterBegin',m);

	// save width/height before hiding
	var bw=b.offsetWidth;
	var bh=b.offsetHeight;

	// hide, move and then show
	b.style.display='none';
	b.style.top=(wh-bh)/2+'px'; /// place notification at center of page
//	b.style.top=wh-bh+'px';// this is to place it to the bottom
	b.style.left=(ww-bw)/2+'px'; /// place notification at center of page
//	b.style.left=ww-bw+'px';// this is to place it to the right
	b.style.display='block';

	// fadeout block if supported
//	opacity(b,100,0,100,function(){d.body.removeChild(b);});
	opacity(b.style,99,0,250,function(){d.body.removeChild(b);}); /// CHANGE fourth argument to opacity for fadeout speed
}

var __alert=window.alert;

var notifier=null;
notifier=new Notifier(document);
notifier.init();
