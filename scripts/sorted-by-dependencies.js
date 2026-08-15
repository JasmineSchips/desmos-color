export function sortedByDependencies(changes) {
	let sortedValues = [];
	let sortedNames = [];
	let names = [];
	for (const id in changes) {
		const change = changes[id];
		if (change.name) names.push(change.name);
		else sortedValues.push(change);
	}
	while (sortedNames.length < names.length) {
		for (const id in changes) {
			const change = changes[id];
			if (!change.name || sortedNames.includes(change.name)) continue;
			let included = true;
			for (const dep of change.dependencies)
				if (names.includes(dep) && !sortedNames.includes(dep))
					included = false;
			if (included) {
				sortedNames.push(change.name);
				sortedValues.push(change);
			}
		}
	}
	return sortedValues;
}