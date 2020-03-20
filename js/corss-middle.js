class Middle {
	constructor() {
		this.iframeWin = window.parent;
		this.map = {
			/**
			 * 设置数据
			 * @param {Object} key
			 * @param {Object} value
			 */
			setStore(key, value) {
				if (!key) return;
				if (!key instanceof Object) return localStorage.setItem(key, value);
				Object.keys(key).forEach(dataKey => {
					let dataValue = typeof key[dataKey] === 'object' ? JSON.stringify(key[dataKey]) : key[dataKey];
					localStorage.setItem(dataKey, dataValue);
				});
			},

			/**
			 * 获取数据
			 * @param {Object} key
			 */
			getStore(key) {
				if (typeof key === 'string') return localStorage.getItem(key);
				let dataRes = {};
				key.forEach(dataKey => {
					dataRes[dataKey] = localStorage.getItem(dataKey) || null;
				});
				return dataRes;
			},

			/**
			 * 删除数据
			 * @param {Object} key
			 */
			deleteStore(key) {
				let removeKeys = [...key];
				removeKeys.forEach(dataKey => {
					localStorage.removeItem(dataKey);
				});
			},

			/**
			 * 清空
			 */
			clearStore() {
				localStorage.clear();
			}
		};

		this._initListener(); //监听消息
	}

	/**
	 * 监听
	 */
	_initListener() {
		window.addEventListener('message', (e) => {
			let {
				method,
				key,
				value,
				id = "default",
				...res
			} = e.data;

			//取出本地的数据
			let mapFun = this.map[`${method}Store`];

			if (!mapFun) {
				return this.iframeWin.postMessage({
					id,
					request: e.data,
					reponse: 'Request mode error!'
				}, '*');
			}

			//取出本地的数据
			let storeData = mapFun(key, value);

			//发送给父亲
			this.iframeWin.postMessage({
				id,
				request: e.data,
				reponse: storeData
			}, '*');
		})
	}
}
