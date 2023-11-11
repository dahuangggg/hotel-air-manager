from django.test import TestCase

# Create your tests here.
# 测试class getAcInfo(APIView)
class getAcInfoTest(TestCase):
    def setUp(self):
        User.objects.create(name='test', password='test')
        Conditioner.objects.create(room_number=User.objects.get(name='test'), temperature_now=25, temperature_set=25, mode='0', status=False)
    def test_getAcInfo(self):
        response = self.client.get('/api/conditioners/get_ac_info', {'token': 'test'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['room_number'], 'test')
        self.assertEqual(response.json()['currentTemperature'], 25)
        self.assertEqual(response.json()['targetTemperature'], 25)
        self.assertEqual(response.json()['acStatus'], False)
        self.assertEqual(response.json()['acMode'], '0')
    def tearDown(self):
        User.objects.get(name='test').delete()
        Conditioner.objects.get(room_number=User.objects.get(name='test')).delete()