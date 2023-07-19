# Steps to publish

## 1. Copy files

```
npm run prepublish

npm run copy
```

## 2. Update these for version info

- package.json
- package-lock.json
- CHANGELOG.md

## 3. Commit and push correct version of $1

```
git add --all

git commit -m "$1"
```

## 3. Add tags

```
git tag -a $1 -m "$1"

git push origin $1

git push
```

## 4. Publish npm package

```
npm publish --access public
```
