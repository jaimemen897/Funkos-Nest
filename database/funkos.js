db = db.getSiblingDB('database')

db.createUser({
  user: 'funko',
  pwd: 'funko',
  roles: [{ role: 'readWrite', db: 'database' }],
})
