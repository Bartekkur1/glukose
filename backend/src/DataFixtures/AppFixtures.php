<?php

namespace App\DataFixtures;

use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use App\Entity\User;
use App\Entity\Sugar;
use App\Entity\UserInfo;
use App\Entity\Meal;
use App\Entity\Dose;

class AppFixtures extends Fixture
{
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $admin = new User();
        $admin->setUsername("Admin");
        $admin->setEmail("Admin@admin.admin");
        $password = $this->encoder->encodePassword($admin, 'haslo123');
        $admin->setPassword($password);
        $admin->setToken("1234");
        $manager->persist($admin);

        $userInfo = new UserInfo();
        $userInfo->setUser($admin);
        $userInfo->setAge(18);
        $userInfo->setDailyInsulinAmount(24);
        $userInfo->setDailyInsulinType("Lantus");
        $userInfo->setInsulinType("Humalog");
        $userInfo->setGender("Mężczyzna");
        $userInfo->setHeight(187);
        $userInfo->setWeight(80);
        $manager->persist($userInfo);

        for($i = 0; $i <= 150; $i++)
        {
            $date = new \DateTime("2019-03-" . \random_int(1, 30) . " " . random_int(1,24) . ":00:00"); //2019-3-20 
            $sugar = new Sugar;
            $sugar->setAmount(random_int(70,250));
            $sugar->setDate($date);
            $sugar->setUser($admin);
            $manager->persist($sugar);
        }

        for($i = 0; $i <= 150; $i++)
        {
            $date = new \DateTime("2019-03-" . \random_int(1, 30) . " " . random_int(1,24) . ":00:00"); //2019-3-20 
            $dose = new Dose();
            $dose->setAmount(random_int(3, 12));
            $dose->setUser($admin);
            $dose->setType("Posiłek");
            $dose->setDate($date);
            $manager->persist($dose);
        }

        for($i = 0; $i <= 30; $i++)
        {
            $date = new \DateTime("2019-03-" . \random_int(1, 30) . " " . random_int(1,24) . ":00:00"); //2019-3-20 
            $dose = new Dose();
            $dose->setAmount(random_int(2, 6));
            $dose->setUser($admin);
            $dose->setType("Korekta");
            $dose->setDate($date);
            $manager->persist($dose);
        }

        for($i = 0; $i <= 150; $i++)
        {
            $date = new \DateTime("2019-03-" . \random_int(1, 30) . " " . random_int(1,24) . ":00:00"); //2019-3-20 
            $meal = new Meal();
            $meal->setKcal(random_int(400,700));
            $meal->setFats(random_int(10,60));
            $meal->setCarbohydrates(100-$meal->getFats());
            $meal->setUser($admin);
            $meal->setDate($date);
            $manager->persist($meal);
        }

        $manager->flush();
    }
}
