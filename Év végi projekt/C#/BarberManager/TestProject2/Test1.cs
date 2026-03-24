using BarberManager.Models;
using BarberManager.Services;
using BarberManager.ViewModels;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BarberManager.Tests
{
    [TestClass]
    public class SimpleLogicTests
    {
        // modell teszt
        // szolgaltatas jol jelenik-e meg a listaban
        [TestMethod]
        public void ServiceDisplayTextTest()
        {
            var service = new Service
            {
                Name = "Hajvágás",
                Price = 5000,
                DurationMinutes = 30
            };

            string result = service.DisplayText;

            Assert.AreEqual("Hajvágás - 5000 Ft (30 perc)", result);
        }

        // modell teszt
        // user displayname
        [TestMethod]
        public void UserDisplayFormatTest()
        {
            var user = new User { Name = "Teszt Elek", Email = "teszt@gmail.com" };

            Assert.AreEqual("Teszt Elek (teszt@gmail.com)", user.DisplayName);
        }

        // viewmodel teszt
        // jelszo svg test
        [TestMethod]
        public void PasswordSVGTest()
        {
            var api = new ApiService();
            var vm = new LoginViewModel(api);

            string result = vm.PasswordIcon;

            Assert.IsTrue(result.StartsWith("M23.7069"));
        }

        // viewmodel teszt
        // toggle method test
        [TestMethod]
        public void PasswordRevealTest()
        {
            var api = new ApiService();
            var vm = new LoginViewModel(api);

            bool defaultState = vm.IsPasswordVisible; 

            vm.TogglePasswordVisibilityCommand.Execute(null);

            Assert.AreNotEqual(defaultState, vm.IsPasswordVisible);
            Assert.IsTrue(vm.IsPasswordVisible);
        }
    }
}