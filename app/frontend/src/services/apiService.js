export default {

  async sendRegistrationEmail() {
    try {
      // const response = await apiAxios.post(ApiRoutes.EMAIL, registrationForm, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });
      const response = {
        'data' : true
      };

      return response.data;
    } catch (e) {
      console.log(`Failed to post email registration form - ${e}`); // eslint-disable-line no-console
      throw e;
    }
  },

};
