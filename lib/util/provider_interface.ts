export interface BasicProvider {
  getUserList: (data: any) => Promise<any>;
  searchAnime: (vars: any) => Promise<any>;
  updateAnime: (vars: any) => Promise<any>;
  removeAnime: (vars: any) => Promise<any>;
  addAnime: (vars: any) => Promise<any>;
};
