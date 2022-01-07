const nullify = <ValueType>(obj: any, keys: string[], predicate: (v: ValueType) => boolean): void => {
	for (const key of keys) {
		if (predicate(obj[key])) {
			obj[key] = null;
		}
	}

	return obj;
}

export default nullify;
