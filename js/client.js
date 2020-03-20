class Client {
	constructor(middlewareUrl) {
		this.middlewareUrl = middlewareUrl;
		this.id = null;
		this._requests = {}; //所有请求消息数据映射
		//获取 iframe window 对象
		this._iframeWin = this._createIframe(this.middlewareUrl).contentWindow
		this._initListener(); //监听
	}

	/**
	 * 获取存储数据
	 * @param {Object} key
	 * @param {Object} callback
	 */
	getItem(key, callback) {
		this._requestFn('get', {
			key,
			callback,
		})
	}

	/**
	 * 更新存储数据
	 * @param {Object} key
	 * @param {Object} value
	 * @param {Object} callback
	 */
	setItem(key, value, callback) {
		this._requestFn('set', {
			key,
			value,
			callback,
		})
	}

	/**
	 * 删除数据
	 * @param {Object} key
	 * @param {Object} callback
	 */
	delItem(key, callback) {
		this._requestFn('delete', {
			key,
			value: null,
			callback,
		})
	}

	/**
	 * 发起请求函数
	 * @param method 请求方式  
	 */
	_requestFn(method, {
		key,
		value,
		callback
	}) {
		// 发消息时，请求对象格式
		let req = {
			id: this.uuid(),
			method,
			key,
			value,
		}

		//请求唯一标识 id 和回调函数的映射
		this._requests[req.id] = callback;
		this._iframeWin.postMessage(req, '*')
	}

	/**
	 * 生成随机ID
	 */
	uuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	/**
	 * 初始化监听函数
	 */
	_initListener() {
		// 监听 iframe “中转页面”返回的消息
		window.addEventListener('message', (e) => {
			let {
				id,
				request,
				reponse
			} = e.data;


			// 找到“中转页面”的消息对应的回调函数
			let currentCallback = this._requests[id]
			if (!currentCallback) return
			// 调用并返回数据
			currentCallback(reponse, e.data);
		})
	}

	/**
	 * 创建 iframe 标签
	 * @param {Object} middlewareUrl
	 * @return Object
	 */
	_createIframe(middlewareUrl) {
		const iframe = document.createElement('iframe')
		iframe.src = middlewareUrl
		iframe.style = 'display: none;'
		window.document.body.appendChild(iframe)
		return iframe
	}
}
