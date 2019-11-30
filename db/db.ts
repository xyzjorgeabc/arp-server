import {createConnection, Connection} from 'mysql';

export const dbconn: Connection = createConnection({
  host: 'localhost',
  database: 'sbrp',
  user: 'root',
  password: '',
  multipleStatements: true
});

export function repformat( query: string, key: string, value: any){
  const reg = new RegExp("\:(" + key + ")(?=\\W)", "g");
  return query.replace(reg, dbconn.escape(value));
}