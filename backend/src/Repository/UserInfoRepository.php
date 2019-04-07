<?php

namespace App\Repository;

use App\Entity\UserInfo;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method UserInfo|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserInfo|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserInfo[]    findAll()
 * @method UserInfo[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserInfoRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, UserInfo::class);
    }

}
